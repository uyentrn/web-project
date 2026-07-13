const { invalid, notFound, translatePrismaError } = require('./errors');

const productInclude = {
  category: true,
  variants: { orderBy: [{ sizeMl: 'asc' }, { concentration: 'asc' }] },
  notes: { include: { note: true }, orderBy: { layerType: 'asc' } },
};

class ProductService {
  constructor(prisma) { this.prisma = prisma; }

  async list({ category, scent, min_price: minPrice, limit, offset } = {}) {
    const { take, skip } = pagination(limit, offset);
    const where = {};
    if (category) where.category = { name: { equals: text(category, 'Category'), mode: 'insensitive' } };
    if (scent) where.notes = { some: { note: { name: { contains: text(scent, 'Scent'), mode: 'insensitive' } } } };
    if (minPrice != null) where.variants = { some: { price: { gte: decimal(minPrice, 'Minimum price') } } };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({ where, include: productInclude, take, skip, orderBy: { createdAt: 'desc' } }),
      this.prisma.product.count({ where }),
    ]);
    return { data, total, limit: take, offset: skip };
  }

  async search(query, options = {}) {
    const q = text(query, 'Search query');
    const { take, skip } = pagination(options.limit, options.offset);
    const where = { name: { contains: q, mode: 'insensitive' } };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({ where, include: productInclude, take, skip, orderBy: { name: 'asc' } }),
      this.prisma.product.count({ where }),
    ]);
    return { data, total, limit: take, offset: skip };
  }

  async getById(id) {
    const product = await this.prisma.product.findUnique({ where: { id }, include: productInclude });
    if (!product) throw notFound('Product');
    return product;
  }

  async create(input) { return this.#writeProduct(input); }
  async update(id, input) { return this.#writeProduct(input, id); }

  async remove(id) {
    try { return await this.prisma.product.delete({ where: { id } }); }
    catch (error) { throw translatePrismaError(error); }
  }

  async #writeProduct(input, id) {
    const data = productData(input);
    try {
      if (id) return await this.prisma.product.update({ where: { id }, data, include: productInclude });
      return await this.prisma.product.create({ data, include: productInclude });
    } catch (error) { throw translatePrismaError(error); }
  }
}

function productData(input) {
  if (!input || typeof input !== 'object') throw invalid('Product data is required.');
  const data = {
    name: text(input.name, 'Name'), brand: text(input.brand, 'Brand'), description: text(input.description, 'Description'),
    imageUrl: text(input.imageUrl, 'Image URL'), categoryId: text(input.categoryId, 'Category ID'),
  };
  if (input.variants !== undefined) data.variants = { deleteMany: {}, create: variants(input.variants) };
  if (input.notes !== undefined) data.notes = { deleteMany: {}, create: notes(input.notes) };
  return data;
}
function variants(value) {
  if (!Array.isArray(value) || !value.length) throw invalid('At least one product variant is required.');
  return value.map((item) => ({ sku: text(item.sku, 'Variant SKU'), sizeMl: positiveInteger(item.sizeMl, 'Variant size'), concentration: text(item.concentration, 'Variant concentration'), price: decimal(item.price, 'Variant price'), stock: nonNegativeInteger(item.stock, 'Variant stock') }));
}
function notes(value) {
  if (!Array.isArray(value)) throw invalid('Product notes must be an array.');
  const allowedLayers = new Set(['top', 'heart', 'base']);
  return value.map((item) => {
    if (!item || !item.noteId || !allowedLayers.has(item.layerType)) throw invalid('Each note requires a note ID and valid scent layer.');
    return { noteId: item.noteId, layerType: item.layerType };
  });
}
function pagination(limit, offset) {
  const take = limit == null ? 20 : positiveInteger(limit, 'Limit');
  const skip = offset == null ? 0 : nonNegativeInteger(offset, 'Offset');
  if (take > 100) throw invalid('Limit cannot exceed 100.');
  return { take, skip };
}
function text(value, field) { if (typeof value !== 'string' || !value.trim()) throw invalid(`${field} is required.`); return value.trim(); }
function positiveInteger(value, field) { const parsed = Number(value); if (!Number.isInteger(parsed) || parsed <= 0) throw invalid(`${field} must be a positive integer.`); return parsed; }
function nonNegativeInteger(value, field) { const parsed = Number(value); if (!Number.isInteger(parsed) || parsed < 0) throw invalid(`${field} must be a non-negative integer.`); return parsed; }
function decimal(value, field) { if (!/^\d+(\.\d{1,2})?$/.test(String(value)) || Number(value) < 0) throw invalid(`${field} must be a non-negative decimal with up to two places.`); return String(value); }

module.exports = ProductService;

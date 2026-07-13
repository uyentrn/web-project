const { invalid, notFound, translatePrismaError } = require('./errors');

class CategoryService {
  constructor(prisma) { this.prisma = prisma; }

  async list() { return this.prisma.category.findMany({ orderBy: { name: 'asc' } }); }

  async getById(id) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw notFound('Category');
    return category;
  }

  async create({ name }) { return this.#write(() => this.prisma.category.create({ data: { name: requiredText(name, 'Category name') } })); }
  async update(id, { name }) { return this.#write(() => this.prisma.category.update({ where: { id }, data: { name: requiredText(name, 'Category name') } })); }
  async remove(id) { return this.#write(() => this.prisma.category.delete({ where: { id } })); }

  async #write(operation) { try { return await operation(); } catch (error) { throw translatePrismaError(error); } }
}

function requiredText(value, field) {
  if (typeof value !== 'string' || !value.trim()) throw invalid(`${field} is required.`);
  return value.trim();
}

module.exports = CategoryService;

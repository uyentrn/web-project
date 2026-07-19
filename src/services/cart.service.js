const { invalid, notFound, translatePrismaError } = require('./errors');

const cartInclude = { items: { include: { variant: { include: { product: true } } }, orderBy: { createdAt: 'asc' } } };

class CartService {
  constructor(prisma) { this.prisma = prisma; }

  async get(userId) {
    requireId(userId, 'User');
    const cart = await this.prisma.cart.findUnique({ where: { userId }, include: cartInclude });
    return cart || { items: [] };
  }

  async addItem(userId, { variantId, quantity }) {
    requireId(userId, 'User'); requireId(variantId, 'Variant'); quantity = positiveInteger(quantity, 'Quantity');
    return this.prisma.$transaction(async (tx) => {
      const variant = await tx.productVariant.findUnique({ where: { id: variantId } });
      if (!variant) throw notFound('Product variant');
      // const cart = await tx.cart.upsert({ where: { userId }, create: { userId }, update: {} });
      const cart = await tx.cart.findUnique({ where: { userId } });
      if (!cart) { throw new Error('Cart not found.'); }
      const existing = await tx.cartItem.findUnique({ where: { cartId_variantId: { cartId: cart.id, variantId } } });
      const nextQuantity = quantity + (existing?.quantity || 0);
      if (variant.stock < nextQuantity) throw invalid('Requested quantity exceeds available stock.');
      if (existing) await tx.cartItem.update({ where: { id: existing.id }, data: { quantity: nextQuantity } });
      else await tx.cartItem.create({ data: { cartId: cart.id, variantId, quantity } });
      return tx.cart.findUnique({ where: { id: cart.id }, include: cartInclude });
    });
  }

  async updateItem(userId, itemId, quantity) {
    requireId(userId, 'User'); requireId(itemId, 'Cart item'); quantity = positiveInteger(quantity, 'Quantity');
    return this.prisma.$transaction(async (tx) => {
      const item = await tx.cartItem.findFirst({ where: { id: itemId, cart: { userId } }, include: { variant: true } });
      if (!item) throw notFound('Cart item');
      if (item.variant.stock < quantity) throw invalid('Requested quantity exceeds available stock.');
      await tx.cartItem.update({ where: { id: itemId }, data: { quantity } });
      return tx.cart.findUnique({ where: { id: item.cartId }, include: cartInclude });
    });
  }

  async removeItem(userId, itemId) {
    requireId(userId, 'User'); requireId(itemId, 'Cart item');
    try {
      const item = await this.prisma.cartItem.findFirst({ where: { id: itemId, cart: { userId } } });
      if (!item) throw notFound('Cart item');
      await this.prisma.cartItem.delete({ where: { id: item.id } });
    } catch (error) { throw translatePrismaError(error); }
  }
}

function requireId(value, field) { if (typeof value !== 'string' || !value) throw invalid(`${field} ID is required.`); }
function positiveInteger(value, field) { const parsed = Number(value); if (!Number.isInteger(parsed) || parsed <= 0) throw invalid(`${field} must be a positive integer.`); return parsed; }

module.exports = CartService;

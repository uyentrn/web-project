const { invalid, notFound, translatePrismaError } = require('./errors');

const orderInclude = { items: { include: { variant: { include: { product: true } } } } };

class OrderService {
  constructor(prisma) { this.prisma = prisma; }

  async checkout(userId, { shippingAddress }) {
    requireId(userId, 'User');
    const address = requiredText(shippingAddress, 'Shipping address');
    try {
      return await this.prisma.$transaction(async (tx) => {
        const cart = await tx.cart.findUnique({ where: { userId }, include: { items: { include: { variant: true } } } });
        if (!cart || !cart.items.length) throw invalid('Cannot checkout an empty cart.');

        let totalCents = 0n;
        for (const item of cart.items) {
          const update = await tx.productVariant.updateMany({
            where: { id: item.variantId, stock: { gte: item.quantity } },
            data: { stock: { decrement: item.quantity } },
          });
          if (!update.count) throw invalid(`Insufficient stock for variant ${item.variantId}.`);
          totalCents += cents(item.variant.price) * BigInt(item.quantity);
        }

        const order = await tx.order.create({
          data: {
            userId, shippingAddress: address, totalAmount: decimalString(totalCents),
            items: { create: cart.items.map((item) => ({ variantId: item.variantId, quantity: item.quantity, priceAtPurchase: item.variant.price.toString() })) },
          },
          include: orderInclude,
        });
        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
        return order;
      });
    } catch (error) { throw translatePrismaError(error); }
  }

  async listForUser(userId, { limit = 20, offset = 0 } = {}) {
    requireId(userId, 'User');
    const take = positiveInteger(limit, 'Limit'); const skip = nonNegativeInteger(offset, 'Offset');
    if (take > 100) throw invalid('Limit cannot exceed 100.');
    const where = { userId };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({ where, include: orderInclude, take, skip, orderBy: { createdAt: 'desc' } }),
      this.prisma.order.count({ where }),
    ]);
    return { data, total, limit: take, offset: skip };
  }

  async getForUser(userId, orderId) {
    requireId(userId, 'User'); requireId(orderId, 'Order');
    const order = await this.prisma.order.findFirst({ where: { id: orderId, userId }, include: orderInclude });
    if (!order) throw notFound('Order');
    return order;
  }

  async listAll({ limit = 20, offset = 0 } = {}) {
    const take = positiveInteger(limit, 'Limit');
    const skip = nonNegativeInteger(offset, 'Offset');

    if (take > 100) {
      throw invalid('Limit cannot exceed 100.');
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        include: orderInclude,
        take,
        skip,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.order.count(),
    ]);

    return {
      data,
      total,
      limit: take,
      offset: skip,
    };
  }

  async getById(orderId) {
    requireId(orderId, 'Order');

    const order = await this.prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: orderInclude,
    });

    if (!order) {
      throw notFound('Order');
    }

    return order;
  }
}

function cents(price) {
  const [whole, fractional = ''] = price.toString().split('.');
  return BigInt(whole) * 100n + BigInt((fractional + '00').slice(0, 2));
}
function decimalString(value) { return `${value / 100n}.${String(value % 100n).padStart(2, '0')}`; }
function requireId(value, field) { if (typeof value !== 'string' || !value) throw invalid(`${field} ID is required.`); }
function requiredText(value, field) { if (typeof value !== 'string' || !value.trim()) throw invalid(`${field} is required.`); return value.trim(); }
function positiveInteger(value, field) { const parsed = Number(value); if (!Number.isInteger(parsed) || parsed <= 0) throw invalid(`${field} must be a positive integer.`); return parsed; }
function nonNegativeInteger(value, field) { const parsed = Number(value); if (!Number.isInteger(parsed) || parsed < 0) throw invalid(`${field} must be a non-negative integer.`); return parsed; }

module.exports = OrderService;

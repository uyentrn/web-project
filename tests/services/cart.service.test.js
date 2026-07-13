const CartService = require('../../src/services/cart.service');

describe('CartService', () => {
  it('returns an empty cart when the user has not added items', async () => {
    const prisma = { cart: { findUnique: jest.fn().mockResolvedValue(null) } };

    await expect(new CartService(prisma).get('user-1')).resolves.toEqual({ items: [] });
  });

  it('rejects a quantity that exceeds available variant stock', async () => {
    const tx = {
      productVariant: { findUnique: jest.fn().mockResolvedValue({ id: 'variant-1', stock: 2 }) },
      cart: { upsert: jest.fn() },
      cartItem: { findUnique: jest.fn().mockResolvedValue(null) },
    };
    const prisma = { $transaction: jest.fn((operation) => operation(tx)) };

    await expect(new CartService(prisma).addItem('user-1', { variantId: 'variant-1', quantity: 3 }))
      .rejects.toMatchObject({ statusCode: 400, code: 'VALIDATION_ERROR' });
    expect(tx.cart.upsert).toHaveBeenCalledTimes(1);
  });

  it('rejects a non-positive quantity before opening a transaction', async () => {
    const prisma = { $transaction: jest.fn() };

    await expect(new CartService(prisma).addItem('user-1', { variantId: 'variant-1', quantity: 0 }))
      .rejects.toMatchObject({ statusCode: 400, code: 'VALIDATION_ERROR' });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
});

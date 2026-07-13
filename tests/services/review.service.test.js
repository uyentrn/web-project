const ReviewService = require('../../src/services/review.service');

describe('ReviewService', () => {
  it('allows a verified purchaser to create a review', async () => {
    const prisma = {
      $transaction: jest.fn().mockResolvedValue([{ id: 'product-1' }, { id: 'order-1' }]),
      review: { create: jest.fn().mockResolvedValue({ id: 'review-1', rating: 5, comment: 'Excellent' }) },
    };

    await expect(new ReviewService(prisma).create('user-1', 'product-1', { rating: 5, comment: ' Excellent ' }))
      .resolves.toEqual({ id: 'review-1', rating: 5, comment: 'Excellent' });
    expect(prisma.review.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ userId: 'user-1', productId: 'product-1', rating: 5, comment: 'Excellent' }) }));
  });

  it('forbids review creation when the customer has not purchased the product', async () => {
    const prisma = { $transaction: jest.fn().mockResolvedValue([{ id: 'product-1' }, null]) };

    await expect(new ReviewService(prisma).create('user-1', 'product-1', { rating: 4 }))
      .rejects.toMatchObject({ statusCode: 403, code: 'FORBIDDEN' });
  });

  it('rejects an out-of-range rating without querying Prisma', async () => {
    const prisma = { $transaction: jest.fn() };

    await expect(new ReviewService(prisma).create('user-1', 'product-1', { rating: 6 }))
      .rejects.toMatchObject({ statusCode: 400, code: 'VALIDATION_ERROR' });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
});

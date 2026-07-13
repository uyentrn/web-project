const { forbidden, invalid, notFound, translatePrismaError } = require('./errors');

class ReviewService {
  constructor(prisma) { this.prisma = prisma; }

  async listForProduct(productId, { limit = 20, offset = 0 } = {}) {
    requireId(productId, 'Product');
    const take = positiveInteger(limit, 'Limit'); const skip = nonNegativeInteger(offset, 'Offset');
    if (take > 100) throw invalid('Limit cannot exceed 100.');
    const product = await this.prisma.product.findUnique({ where: { id: productId }, select: { id: true } });
    if (!product) throw notFound('Product');
    const where = { productId };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.review.findMany({ where, select: { id: true, rating: true, comment: true, createdAt: true, updatedAt: true, user: { select: { id: true, name: true } } }, take, skip, orderBy: { createdAt: 'desc' } }),
      this.prisma.review.count({ where }),
    ]);
    return { data, total, limit: take, offset: skip };
  }

  async create(userId, productId, { rating, comment }) {
    requireId(userId, 'User'); requireId(productId, 'Product');
    const parsedRating = Number(rating);
    if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) throw invalid('Rating must be an integer from 1 to 5.');
    if (comment != null && (typeof comment !== 'string' || !comment.trim())) throw invalid('Comment must be a non-empty string.');

    const [product, purchase] = await this.prisma.$transaction([
      this.prisma.product.findUnique({ where: { id: productId }, select: { id: true } }),
      this.prisma.order.findFirst({ where: { userId, status: { in: ['paid', 'shipping', 'completed'] }, items: { some: { variant: { productId } } } }, select: { id: true } }),
    ]);
    if (!product) throw notFound('Product');
    if (!purchase) throw forbidden('Only verified purchasers can review this product.');
    try { return await this.prisma.review.create({ data: { userId, productId, rating: parsedRating, comment: comment?.trim() || null } }); }
    catch (error) { throw translatePrismaError(error); }
  }

  async update(userId, reviewId, { rating, comment }) {
    requireId(userId, 'User'); requireId(reviewId, 'Review');
    const data = {};
    if (rating !== undefined) { const value = Number(rating); if (!Number.isInteger(value) || value < 1 || value > 5) throw invalid('Rating must be an integer from 1 to 5.'); data.rating = value; }
    if (comment !== undefined) { if (comment != null && (typeof comment !== 'string' || !comment.trim())) throw invalid('Comment must be a non-empty string.'); data.comment = comment?.trim() || null; }
    if (!Object.keys(data).length) throw invalid('At least one review field is required.');
    const review = await this.prisma.review.findFirst({ where: { id: reviewId, userId } });
    if (!review) throw notFound('Review');
    try { return await this.prisma.review.update({ where: { id: reviewId }, data }); }
    catch (error) { throw translatePrismaError(error); }
  }

  async remove(userId, reviewId) {
    requireId(userId, 'User'); requireId(reviewId, 'Review');
    const review = await this.prisma.review.findFirst({ where: { id: reviewId, userId } });
    if (!review) throw notFound('Review');
    return this.prisma.review.delete({ where: { id: reviewId } });
  }
}

function requireId(value, field) { if (typeof value !== 'string' || !value) throw invalid(`${field} ID is required.`); }
function positiveInteger(value, field) { const parsed = Number(value); if (!Number.isInteger(parsed) || parsed <= 0) throw invalid(`${field} must be a positive integer.`); return parsed; }
function nonNegativeInteger(value, field) { const parsed = Number(value); if (!Number.isInteger(parsed) || parsed < 0) throw invalid(`${field} must be a non-negative integer.`); return parsed; }

module.exports = ReviewService;

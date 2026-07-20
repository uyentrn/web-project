const reviews = require('../data/reviews');

module.exports = async function seedReviews(prisma) {
  const result = [];

  for (const review of reviews) {
    const user = await prisma.user.findUnique({
      where: {
        email: review.userEmail,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new Error(`User not found: ${review.userEmail}`);
    }

    const product = await prisma.product.findUnique({
      where: {
        name_brand: {
          name: review.productName,
          brand: review.productBrand,
        },
      },
      select: {
        id: true,
      },
    });

    if (!product) {
      throw new Error(
        `Product not found: ${review.productBrand} - ${review.productName}`
      );
    }

    const created = await prisma.review.upsert({
      where: {
        userId_productId: {
          userId: user.id,
          productId: product.id,
        },
      },
      update: {
        rating: review.rating,
        comment: review.comment ?? null,
      },
      create: {
        userId: user.id,
        productId: product.id,
        rating: review.rating,
        comment: review.comment ?? null,
      },
    });

    result.push(created);
  }

  return result;
};
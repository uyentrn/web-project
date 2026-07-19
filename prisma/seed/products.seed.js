const products = require('../data/products');

module.exports = async function seedProducts(prisma, categories) {
  const categoryMap = new Map(
    categories.map((category) => [category.name, category.id])
  );

  const result = [];

  for (const product of products) {
    const categoryId = categoryMap.get(product.category);

    if (!categoryId) {
      throw new Error(
        `Category "${product.category}" does not exist.`
      );
    }

    const created = await prisma.product.create({
      data: {
        name: product.name,
        brand: product.brand,
        description: product.description,
        imageUrl: product.imageUrl,
        categoryId,
      },
    });

    result.push(created);
  }

  return result;
};
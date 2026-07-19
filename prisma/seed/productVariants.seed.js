const productVariants = require('../data/productVariants');

module.exports = async function seedProductVariants(prisma, products) {
  const productMap = new Map(
    products.map((product) => [
      `${product.name}|${product.brand}`,
      product.id,
    ])
  );

  const result = [];

  for (const item of productVariants) {
    const key = `${item.product.name}|${item.product.brand}`;
    const productId = productMap.get(key);

    if (!productId) {
      throw new Error(`Product not found: ${key}`);
    }

    for (const variant of item.variants) {
      const created = await prisma.productVariant.create({
        data: {
          productId,
          sku: variant.sku,
          sizeMl: variant.sizeMl,
          concentration: variant.concentration,
          price: variant.price,
          stock: variant.stock,
        },
      });

      result.push(created);
    }
  }

  return result;
};
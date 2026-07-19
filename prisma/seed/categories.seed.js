const categories = require('../data/categories');

module.exports = async function seedCategories(prisma) {
  const result = [];

  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: {
        name: category.name,
      },
      update: {},
      create: {
        name: category.name,
      },
    });

    result.push(created);
  }

  return result;
};
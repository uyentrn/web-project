const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const seedUsers = require("./seed/users.seed");
const seedCategories = require("./seed/categories.seed");
const seedNotes = require("./seed/notes.seed");
const seedProducts = require("./seed/products.seed");
const seedProductVariants = require("./seed/productVariants.seed");
const seedProductNotes = require("./seed/productNotes.seed");
const seedCarts = require("./seed/carts.seed");
const seedOrders = require("./seed/orders.seed");
const seedReviews = require("./seed/reviews.seed");
// const seedSessions = require("./seed/sessions.seed");

async function main() {
  console.log("Starting database seed...\n");

  const users = await seedUsers(prisma);
  console.log("✓ Users");

  const categories = await seedCategories(prisma);
  console.log("✓ Categories");

  const notes = await seedNotes(prisma);
  console.log("✓ Notes");

  const products = await seedProducts(prisma, categories);
  console.log("✓ Products");

  const variants = await seedProductVariants(prisma, products);
  console.log("✓ Product Variants");

  await seedProductNotes(prisma, products, notes);
  console.log("✓ Product Notes");

  await seedCarts(prisma, users, variants);
  console.log("✓ Carts");

  await seedOrders(prisma, users, variants);
  console.log("✓ Orders");

  await seedReviews(prisma, users, products);
  console.log("✓ Reviews");

  // await seedSessions(prisma, users);

  console.log("\n🎉 Database seeded successfully!");
}

main()
  .catch((error) => {
    console.error("Seed failed");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
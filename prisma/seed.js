const { PrismaClient, ScentLayer } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.productNote.deleteMany();
  await prisma.review.deleteMany();
  await prisma.session.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.note.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const [floral, woody, citrus] = await Promise.all([
    prisma.category.create({ data: { name: 'Floral' } }),
    prisma.category.create({ data: { name: 'Woody' } }),
    prisma.category.create({ data: { name: 'Citrus' } }),
  ]);

  const [bergamot, rose, jasmine, sandalwood, vanilla] = await Promise.all([
    prisma.note.create({ data: { name: 'Bergamot' } }),
    prisma.note.create({ data: { name: 'Rose' } }),
    prisma.note.create({ data: { name: 'Jasmine' } }),
    prisma.note.create({ data: { name: 'Sandalwood' } }),
    prisma.note.create({ data: { name: 'Vanilla' } }),
  ]);

  const floralPerfume = await prisma.product.create({
    data: {
      name: 'Rose Nocturne',
      brand: 'Maison Lumiere',
      description: 'A floral eau de parfum with bright citrus and a warm woody dry-down.',
      imageUrl: 'https://example.com/images/rose-nocturne.jpg',
      categoryId: floral.id,
      variants: {
        create: [
          { sku: 'ML-RN-50-EDP', sizeMl: 50, concentration: 'EDP', price: '89.00', stock: 24 },
          { sku: 'ML-RN-100-EDP', sizeMl: 100, concentration: 'EDP', price: '129.00', stock: 12 },
        ],
      },
      notes: {
        create: [
          { noteId: bergamot.id, layerType: ScentLayer.top },
          { noteId: rose.id, layerType: ScentLayer.heart },
          { noteId: jasmine.id, layerType: ScentLayer.heart },
          { noteId: sandalwood.id, layerType: ScentLayer.base },
        ],
      },
    },
    include: { variants: true },
  });

  const woodyPerfume = await prisma.product.create({
    data: {
      name: 'Cedar Veil',
      brand: 'Atelier Nord',
      description: 'A woody eau de toilette balanced by bergamot and vanilla.',
      imageUrl: 'https://example.com/images/cedar-veil.jpg',
      categoryId: woody.id,
      variants: {
        create: [
          { sku: 'AN-CV-30-EDT', sizeMl: 30, concentration: 'EDT', price: '54.00', stock: 30 },
          { sku: 'AN-CV-100-EDT', sizeMl: 100, concentration: 'EDT', price: '110.00', stock: 16 },
        ],
      },
      notes: {
        create: [
          { noteId: bergamot.id, layerType: ScentLayer.top },
          { noteId: sandalwood.id, layerType: ScentLayer.heart },
          { noteId: vanilla.id, layerType: ScentLayer.base },
        ],
      },
    },
    include: { variants: true },
  });

  await prisma.product.create({
    data: {
      name: 'Citrus Dawn',
      brand: 'Maison Lumiere',
      description: 'A fresh citrus fragrance for everyday wear.',
      imageUrl: 'https://example.com/images/citrus-dawn.jpg',
      categoryId: citrus.id,
      variants: {
        create: { sku: 'ML-CD-50-EDT', sizeMl: 50, concentration: 'EDT', price: '72.00', stock: 20 },
      },
      notes: { create: { noteId: bergamot.id, layerType: ScentLayer.top } },
    },
  });

  const user = await prisma.user.create({
    data: {
      email: 'customer@example.com',
      name: 'Sample Customer',
      passwordHash: 'seed-data-only-not-a-production-password-hash',
    },
  });

  await prisma.cart.create({
    data: {
      userId: user.id,
      items: { create: { variantId: floralPerfume.variants[0].id, quantity: 1 } },
    },
  });

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      totalAmount: '110.00',
      status: 'completed',
      shippingAddress: '123 Sample Street, Bangkok, Thailand',
      items: {
        create: {
          variantId: woodyPerfume.variants[1].id,
          quantity: 1,
          priceAtPurchase: '110.00',
        },
      },
    },
  });

  await prisma.review.create({
    data: {
      userId: user.id,
      productId: woodyPerfume.id,
      rating: 5,
      comment: 'Warm, balanced, and long-lasting.',
    },
  });

  console.log(`Seeded user ${user.email} and completed order ${order.id}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

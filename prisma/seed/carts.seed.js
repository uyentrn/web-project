const cartsData = require('../data/carts');

module.exports = async function seedCarts(prisma, users, variants) {
  const carts = [];

  for (const cartData of cartsData) {
    const user = users.find(
      (u) => u.email === cartData.user.email
    );

    if (!user) continue;

    const cart = await prisma.cart.upsert({
      where: {
        userId: user.id,
      },
      update: {},
      create: {
        userId: user.id,
      },
    });

    for (const item of cartData.items) {
      const variant = variants.find(
        (v) => v.sku === item.sku
      );

      if (!variant) continue;

      await prisma.cartItem.upsert({
        where: {
          cartId_variantId: {
            cartId: cart.id,
            variantId: variant.id,
          },
        },
        update: {
          quantity: item.quantity,
        },
        create: {
          cartId: cart.id,
          variantId: variant.id,
          quantity: item.quantity,
        },
      });
    }

    carts.push(cart);
  }

  return carts;
};
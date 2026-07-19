const ordersData = require('../data/orders');

module.exports = async function seedOrders(prisma, users, variants) {
  const orders = [];

  for (const orderData of ordersData) {
    const user = users.find(
      (u) => u.email === orderData.user.email
    );

    if (!user) continue;

    const totalAmount = orderData.items.reduce((total, item) => {
      return total + item.quantity * item.priceAtPurchase;
    }, 0);

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        shippingAddress: orderData.shippingAddress,
        status: orderData.status,
        totalAmount,
      },
    });

    for (const item of orderData.items) {
      const variant = variants.find(
        (v) => v.sku === item.sku
      );

      if (!variant) continue;

      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          variantId: variant.id,
          quantity: item.quantity,
          priceAtPurchase: item.priceAtPurchase,
        },
      });
    }

    orders.push(order);
  }

  return orders;
};
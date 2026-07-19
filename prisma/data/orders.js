const { OrderStatus } = require('@prisma/client');

module.exports = [
  {
    user: {
      email: 'alice@gmail.com',
    },
    shippingAddress: '123 Nguyen Trai, District 1, Ho Chi Minh City',
    status: OrderStatus.completed,
    items: [
      {
        sku: 'DIOR-SAUVAGE-EDT-100',
        quantity: 1,
        priceAtPurchase: 3300000,
      },
      {
        sku: 'BLEU-EDP-50',
        quantity: 1,
        priceAtPurchase: 2900000,
      },
    ],
  },

  {
    user: {
      email: 'bob@gmail.com',
    },
    shippingAddress: '45 Le Loi, District 3, Ho Chi Minh City',
    status: OrderStatus.shipping,
    items: [
      {
        sku: 'EROS-100',
        quantity: 2,
        priceAtPurchase: 3100000,
      },
    ],
  },

  {
    user: {
      email: 'charlie@gmail.com',
    },
    shippingAddress: '78 Tran Hung Dao, Da Nang',
    status: OrderStatus.completed,
    items: [
      {
        sku: 'LIBRE-90',
        quantity: 1,
        priceAtPurchase: 4300000,
      },
      {
        sku: 'BR540-35',
        quantity: 1,
        priceAtPurchase: 6800000,
      },
    ],
  },

  {
    user: {
      email: 'david@gmail.com',
    },
    shippingAddress: '12 Hai Ba Trung, Hanoi',
    status: OrderStatus.pending,
    items: [
      {
        sku: 'OMBRE-100',
        quantity: 1,
        priceAtPurchase: 5900000,
      },
    ],
  },

  {
    user: {
      email: 'emma@gmail.com',
    },
    shippingAddress: '99 Vo Van Tan, Ho Chi Minh City',
    status: OrderStatus.paid,
    items: [
      {
        sku: 'COCO-MAD-50',
        quantity: 2,
        priceAtPurchase: 3100000,
      },
    ],
  },
];
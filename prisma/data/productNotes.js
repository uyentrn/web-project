const { ScentLayer } = require('@prisma/client');

module.exports = [
  {
    product: {
      name: 'Dior Sauvage Eau de Toilette',
      brand: 'Dior',
    },
    notes: [
      { note: 'Bergamot', layerType: ScentLayer.top },
      { note: 'Pink Pepper', layerType: ScentLayer.top },
      { note: 'Lavender', layerType: ScentLayer.heart },
      { note: 'Vetiver', layerType: ScentLayer.base },
      { note: 'Amber', layerType: ScentLayer.base },
    ],
  },

  {
    product: {
      name: 'Bleu de Chanel Eau de Parfum',
      brand: 'Chanel',
    },
    notes: [
      { note: 'Grapefruit', layerType: ScentLayer.top },
      { note: 'Lemon', layerType: ScentLayer.top },
      { note: 'Lavender', layerType: ScentLayer.heart },
      { note: 'Cedarwood', layerType: ScentLayer.base },
      { note: 'Incense', layerType: ScentLayer.base },
    ],
  },

  {
    product: {
      name: 'Creed Aventus',
      brand: 'Creed',
    },
    notes: [
      { note: 'Pineapple', layerType: ScentLayer.top },
      { note: 'Blackcurrant', layerType: ScentLayer.top },
      { note: 'Rose', layerType: ScentLayer.heart },
      { note: 'Birch', layerType: ScentLayer.base },
      { note: 'Musk', layerType: ScentLayer.base },
    ],
  },

  {
    product: {
      name: 'YSL Libre',
      brand: 'Yves Saint Laurent',
    },
    notes: [
      { note: 'Mandarin', layerType: ScentLayer.top },
      { note: 'Lavender', layerType: ScentLayer.heart },
      { note: 'Orange', layerType: ScentLayer.heart },
      { note: 'Vanilla', layerType: ScentLayer.base },
      { note: 'Amber', layerType: ScentLayer.base },
    ],
  },

  {
    product: {
      name: 'Maison Francis Kurkdjian Baccarat Rouge 540',
      brand: 'Maison Francis Kurkdjian',
    },
    notes: [
      { note: 'Saffron', layerType: ScentLayer.top },
      { note: 'Jasmine', layerType: ScentLayer.heart },
      { note: 'Amber', layerType: ScentLayer.base },
      { note: 'Cedarwood', layerType: ScentLayer.base },
    ],
  },
];
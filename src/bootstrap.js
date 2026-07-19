const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const createApp = require('./app');
const AuthService = require('./services/auth.service');
const CartService = require('./services/cart.service');
const CategoryService = require('./services/category.service');
const OrderService = require('./services/order.service');
const ProductService = require('./services/product.service');
const ReviewService = require('./services/review.service');
const createAuthController = require('./controllers/auth.controller');
const createCartController = require('./controllers/cart.controller');
const createCategoryController = require('./controllers/category.controller');
const createOrderController = require('./controllers/order.controller');
const createAdminOrderController = require('./controllers/admin.order.controller');
const createProductController = require('./controllers/product.controller');
const createReviewController = require('./controllers/review.controller');

let prisma;

function requiredEnvironment(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} must be configured.`);
  return value;
}

function createTokenIssuer() {
  const secret = requiredEnvironment('JWT_SECRET');
  const issuer = process.env.JWT_ISSUER || 'perfume-ecommerce-api';
  const audience = process.env.JWT_AUDIENCE || 'perfume-ecommerce-client';
  const options = { issuer, audience };
  return {
    signAccess: (payload, ttlMs) => jwt.sign(payload, secret, { ...options, expiresIn: Math.floor(ttlMs / 1000) }),
    signRefresh: (payload, ttlMs) => jwt.sign(payload, secret, { ...options, expiresIn: Math.floor(ttlMs / 1000) }),
    verifyAccess: (token) => jwt.verify(token, secret, options),
    verifyRefresh: (token) => jwt.verify(token, secret, options),
  };
}

function unavailableController(methods) {
  const handler = (_req, res) => res.status(501).json({ status: 'error', message: 'This endpoint is not implemented.' });
  return Object.fromEntries(methods.map((method) => [method, handler]));
}

function createApplication() {
  const database = prisma || (prisma = new PrismaClient());
  const tokenIssuer = createTokenIssuer();
  const accessTtlMs = Number(process.env.ACCESS_TOKEN_TTL_SECONDS || 900) * 1000;
  const refreshTtlMs = Number(process.env.REFRESH_TOKEN_TTL_SECONDS || 604800) * 1000;
  const passwordHasher = {
    hash: (password) => bcrypt.hash(password, Number(process.env.BCRYPT_ROUNDS || 12)),
    compare: (password, passwordHash) => bcrypt.compare(password, passwordHash),
  };
  const orderService = new OrderService(database);

  return createApp({
    tokenIssuer,
    controllers: {
      auth: createAuthController(new AuthService(database, { passwordHasher, tokenIssuer, accessTtlMs, refreshTtlMs })),
      cart: createCartController(new CartService(database)),
      category: createCategoryController(new CategoryService(database)),
      order: createOrderController(orderService),
      adminOrder: createAdminOrderController(orderService),
      product: createProductController(new ProductService(database)),
      review: createReviewController(new ReviewService(database)),
      user: unavailableController(['getProfile', 'updateProfile']),
      brand: unavailableController(['list', 'getById']),
      wishlist: unavailableController(['get', 'addItem', 'removeItem']),
      payment: unavailableController(['create', 'getById']),
    },
  });
}

module.exports = { createApplication, createTokenIssuer };

const express = require('express');
const createAuthRouter = require('./routes/auth.route');
const createUserRouter = require('./routes/user.route');
const createBrandRouter = require('./routes/brand.route');
const createCategoryRouter = require('./routes/category.route');
const createProductRouter = require('./routes/product.route');
const createSearchRouter = require('./routes/search.route');
const createCartRouter = require('./routes/cart.route');
const createWishlistRouter = require('./routes/wishlist.route');
const createOrderRouter = require('./routes/order.route');
const createPaymentRouter = require('./routes/payment.route');
const createReviewRouter = require('./routes/review.route');
const createAuthMiddleware = require('./middlewares/auth.middleware');
const requireRole = require('./middlewares/role.middleware');
const createLoggerMiddleware = require('./middlewares/logger.middleware');
const { notFoundHandler, errorHandler } = require('./middlewares/error.middleware');

function createApp({ controllers, tokenIssuer, logger } = {}) {
  if (!controllers) throw new Error('App requires controllers.');
  const app = express();
  const authenticate = createAuthMiddleware({ tokenIssuer });
  const requireAdmin = requireRole('admin');

  app.use(createLoggerMiddleware(logger));
  app.use(express.json());
  app.use('/api/auth', createAuthRouter(controllers.auth, { authenticate }));
  app.use('/api/users', createUserRouter(controllers.user, { authenticate }));
  app.use('/api/brands', createBrandRouter(controllers.brand));
  app.use('/api/categories', createCategoryRouter(controllers.category, { authenticate, requireAdmin }));
  app.use('/api/products', createProductRouter(controllers.product, { authenticate, requireAdmin }));
  app.use('/api/search', createSearchRouter(controllers.product));
  app.use('/api/cart', createCartRouter(controllers.cart, { authenticate }));
  app.use('/api/wishlist', createWishlistRouter(controllers.wishlist, { authenticate }));
  app.use('/api/orders', createOrderRouter(controllers.order, { authenticate }));
  app.use('/api/payments', createPaymentRouter(controllers.payment, { authenticate }));
  app.use('/api', createReviewRouter(controllers.review, { authenticate }));
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;

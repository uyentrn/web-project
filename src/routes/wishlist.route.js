const { Router } = require('express');

module.exports = function createWishlistRouter(controller, { authenticate } = {}) {
  const router = Router();
  router.get('/', authenticate, controller.get);
  router.post('/', authenticate, controller.addItem);
  router.delete('/:itemId', authenticate, controller.removeItem);
  return router;
};

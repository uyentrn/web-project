const { Router } = require('express');

module.exports = function createPaymentRouter(controller, { authenticate } = {}) {
  const router = Router();
  router.post('/', authenticate, controller.create);
  router.get('/:id', authenticate, controller.getById);
  return router;
};

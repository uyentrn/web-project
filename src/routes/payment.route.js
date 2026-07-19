const { Router } = require('express');

module.exports = function createPaymentRouter(controller, { authenticate, requireClient } = {}) {
  const router = Router();
  router.post('/', authenticate, requireClient, controller.create);
  router.get('/:id', authenticate, requireClient, controller.getById);
  return router;
};

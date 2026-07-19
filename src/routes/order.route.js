const { Router } = require('express');
const { validateRequest, requireJsonBody } = require('../middlewares/validation.middleware');

module.exports = function createOrderRouter(controller, { authenticate, requireClient } = {}) {
  const router = Router();
  router.post('/', authenticate, requireClient, validateRequest(requireJsonBody), controller.checkout);
  router.get('/', authenticate, requireClient, controller.list);
  router.get('/:id', authenticate, requireClient, controller.getById);
  return router;
};

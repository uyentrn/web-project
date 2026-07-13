const { Router } = require('express');
const { validateRequest, requireJsonBody } = require('../middlewares/validation.middleware');

module.exports = function createOrderRouter(controller, { authenticate } = {}) {
  const router = Router();
  router.post('/', authenticate, validateRequest(requireJsonBody), controller.checkout);
  router.get('/', authenticate, controller.list);
  router.get('/:id', authenticate, controller.getById);
  return router;
};

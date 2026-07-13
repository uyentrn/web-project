const { Router } = require('express');
const { validateRequest, requireJsonBody } = require('../middlewares/validation.middleware');

module.exports = function createCartRouter(controller, { authenticate } = {}) {
  const router = Router();
  router.get('/', authenticate, controller.get);
  router.post('/', authenticate, validateRequest(requireJsonBody), controller.addItem);
  router.put('/:itemId', authenticate, validateRequest(requireJsonBody), controller.updateItem);
  router.delete('/:itemId', authenticate, controller.removeItem);
  return router;
};

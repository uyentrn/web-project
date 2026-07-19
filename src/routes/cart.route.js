const { Router } = require('express');
const { validateRequest, requireJsonBody } = require('../middlewares/validation.middleware');

module.exports = function createCartRouter(controller, { authenticate, requireClient } = {}) {
  const router = Router();
  router.get('/', authenticate, requireClient, controller.get);
  router.post('/', authenticate, requireClient, validateRequest(requireJsonBody), controller.addItem);
  router.put('/:itemId', authenticate, requireClient, validateRequest(requireJsonBody), controller.updateItem);
  router.delete('/:itemId', authenticate, requireClient, controller.removeItem);
  return router;
};

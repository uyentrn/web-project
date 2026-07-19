const { Router } = require('express');
const { validateRequest, requireJsonBody } = require('../middlewares/validation.middleware');

module.exports = function createOrderRouter(controller, { authenticate, requireAdmin } = {}) {
  const router = Router();
  router.get('/', authenticate, requireAdmin, controller.list);
  router.get('/:id', authenticate, requireAdmin, controller.getById);
  return router;
};

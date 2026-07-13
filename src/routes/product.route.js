const { Router } = require('express');

module.exports = function createProductRouter(controller, { authenticate, requireAdmin } = {}) {
  const router = Router();
  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  router.post('/', authenticate, requireAdmin, controller.create);
  router.put('/:id', authenticate, requireAdmin, controller.update);
  router.delete('/:id', authenticate, requireAdmin, controller.remove);
  return router;
};

const { Router } = require('express');

module.exports = function createBrandRouter(controller) {
  const router = Router();
  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  return router;
};

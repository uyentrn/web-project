const { Router } = require('express');

module.exports = function createSearchRouter(productController) {
  const router = Router();
  router.get('/', productController.search);
  return router;
};

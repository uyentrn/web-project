const { Router } = require('express');
const { validateRequest, requireJsonBody } = require('../middlewares/validation.middleware');

module.exports = function createReviewRouter(controller, { authenticate, requireClient } = {}) {
  const router = Router();
  router.get('/products/:id/reviews', controller.listForProduct);
  router.post('/products/:id/reviews', authenticate, requireClient, validateRequest(requireJsonBody), controller.create);
  router.put('/reviews/:reviewId', authenticate, requireClient, validateRequest(requireJsonBody), controller.update);
  router.delete('/reviews/:reviewId', authenticate, requireClient, controller.remove);
  return router;
};

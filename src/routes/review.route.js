const { Router } = require('express');
const { validateRequest, requireJsonBody } = require('../middlewares/validation.middleware');

module.exports = function createReviewRouter(controller, { authenticate } = {}) {
  const router = Router();
  router.get('/products/:id/reviews', controller.listForProduct);
  router.post('/products/:id/reviews', authenticate, validateRequest(requireJsonBody), controller.create);
  router.put('/reviews/:reviewId', authenticate, validateRequest(requireJsonBody), controller.update);
  router.delete('/reviews/:reviewId', authenticate, controller.remove);
  return router;
};

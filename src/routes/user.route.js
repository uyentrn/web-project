const { Router } = require('express');

module.exports = function createUserRouter(controller, { authenticate } = {}) {
  const router = Router();
  router.get('/me', authenticate, controller.getProfile);
  router.patch('/me', authenticate, controller.updateProfile);
  return router;
};

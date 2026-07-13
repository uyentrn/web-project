const { Router } = require('express');
const { validateRequest, requireJsonBody } = require('../middlewares/validation.middleware');

module.exports = function createAuthRouter(controller, { authenticate } = {}) {
  const router = Router();
  router.post('/register', validateRequest(requireJsonBody), controller.register);
  router.post('/login', validateRequest(requireJsonBody), controller.login);
  router.post('/refresh', validateRequest(requireJsonBody), controller.refresh);
  router.post('/logout', authenticate, controller.logout);
  return router;
};

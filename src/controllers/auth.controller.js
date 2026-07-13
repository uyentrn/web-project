const { handle, sendEmptySuccess, sendSuccess } = require('./response');
const { body, optionalString, requiredString, authenticatedUser } = require('./validation');

module.exports = function createAuthController(authService) {
  if (!authService) throw new Error('Auth controller requires an auth service.');

  return {
    register: handle(async (req, res) => {
      const input = body(req);
      const data = await authService.register({
        email: requiredString(input.email, 'Email'),
        password: requiredString(input.password, 'Password'),
        name: optionalString(input.name, 'Name'),
      });
      return sendSuccess(res, data, 201);
    }),

    login: handle(async (req, res) => {
      const input = body(req);
      const data = await authService.login({
        email: requiredString(input.email, 'Email'),
        password: requiredString(input.password, 'Password'),
      });
      return sendSuccess(res, data);
    }),

    refresh: handle(async (req, res) => {
      const input = body(req);
      const data = await authService.refresh(requiredString(input.refreshToken, 'Refresh token'));
      return sendSuccess(res, data);
    }),

    logout: handle(async (req, res) => {
      const { userId, sessionId } = authenticatedUser(req, { sessionRequired: true });
      await authService.logout({ userId, sessionId });
      return sendEmptySuccess(res);
    }),
  };
};

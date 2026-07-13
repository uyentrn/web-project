const { AppError } = require('../services/errors');

function createAuthMiddleware({ tokenIssuer }) {
  if (!tokenIssuer || typeof tokenIssuer.verifyAccess !== 'function') {
    throw new Error('Auth middleware requires a token issuer with verifyAccess(token).');
  }

  return async function authenticate(req, _res, next) {
    const authorization = req.get ? req.get('authorization') : req.headers?.authorization;
    const match = typeof authorization === 'string' && authorization.match(/^Bearer\s+(.+)$/i);
    if (!match) return next(new AppError('Authentication is required.', 401, 'UNAUTHENTICATED'));

    try {
      const payload = await tokenIssuer.verifyAccess(match[1]);
      if (!payload?.sub) throw new Error('Access token has no subject.');
      req.auth = payload;
      req.user = { id: payload.sub, sessionId: payload.sid, role: payload.role, roles: payload.roles };
      return next();
    } catch {
      return next(new AppError('Invalid or expired access token.', 401, 'INVALID_ACCESS_TOKEN'));
    }
  };
}

module.exports = createAuthMiddleware;

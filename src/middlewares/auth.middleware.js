const { AppError } = require('../services/errors');

function createAuthMiddleware({ tokenIssuer }) {
  if (!tokenIssuer || typeof tokenIssuer.verifyAccess !== 'function') {
    throw new Error(
      'Auth middleware requires a token issuer with verifyAccess(token).'
    );
  }

  return async function authenticate(req, _res, next) {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return next(
        new AppError(
          'Authentication is required.',
          401,
          'UNAUTHENTICATED'
        )
      );
    }

    const [scheme, token] = authorization.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return next(
        new AppError(
          'Authentication is required.',
          401,
          'UNAUTHENTICATED'
        )
      );
    }

    try {
      const payload = await tokenIssuer.verifyAccess(token);

      if (!payload?.sub) {
        throw new Error('Missing subject.');
      }

      const roles = Array.isArray(payload.roles)? payload.roles
        : payload.role? [payload.role]
          : [];

      req.user = {
        id: payload.sub,
        sessionId: payload.sid,
        roles,
      };

      req.token = payload;

      return next();
    } catch (err) {
      return next(
        new AppError(
          'Invalid or expired access token.',
          401,
          'INVALID_ACCESS_TOKEN'
        )
      );
    }
  };
}

module.exports = createAuthMiddleware;
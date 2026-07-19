const { AppError } = require('../services/errors');

function requireRole(...allowedRoles) {
  if (!allowedRoles.length) {
    throw new Error('Role middleware requires at least one allowed role.');
  }

  const allowed = new Set(allowedRoles);

  return function authorize(req, _res, next) {
    if (!req.user) {
      return next(
        new AppError(
          'Authentication is required.',
          401,
          'UNAUTHENTICATED'
        )
      );
    }

    const hasPermission = req.user.roles.some((role) =>
      allowed.has(role)
    );

    if (!hasPermission) {
      return next(
        new AppError(
          'You are not allowed to perform this action.',
          403,
          'FORBIDDEN'
        )
      );
    }

    return next();
  };
}

module.exports = requireRole;
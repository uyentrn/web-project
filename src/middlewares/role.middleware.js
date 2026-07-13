const { AppError } = require('../services/errors');

function requireRole(...allowedRoles) {
  if (!allowedRoles.length) throw new Error('Role middleware requires at least one allowed role.');

  return function authorize(req, _res, next) {
    const roleClaims = req.user?.roles || req.auth?.roles || req.user?.role || req.auth?.role;
    const roles = Array.isArray(roleClaims) ? roleClaims : [roleClaims].filter(Boolean);
    if (!req.user?.id && !req.auth?.sub) return next(new AppError('Authentication is required.', 401, 'UNAUTHENTICATED'));
    if (!roles.some((role) => allowedRoles.includes(role))) {
      return next(new AppError('You are not allowed to perform this action.', 403, 'FORBIDDEN'));
    }
    return next();
  };
}

module.exports = requireRole;

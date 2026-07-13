const { AppError } = require('../services/errors');

function notFoundHandler(req, _res, next) {
  return next(new AppError(`Route ${req.method} ${req.originalUrl} not found.`, 404, 'NOT_FOUND'));
}

function errorHandler(error, _req, res, _next) {
  const isMalformedJson = error?.type === 'entity.parse.failed';
  const statusCode = error instanceof AppError ? error.statusCode : isMalformedJson ? 400 : 500;
  const message = error instanceof AppError ? error.message : isMalformedJson ? 'Request body must contain valid JSON.' : 'An unexpected error occurred.';
  return res.status(statusCode).json({ status: 'error', message });
}

module.exports = { notFoundHandler, errorHandler };

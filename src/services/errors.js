class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

function notFound(resource) {
  return new AppError(`${resource} not found.`, 404, 'NOT_FOUND');
}

function forbidden(message = 'You are not allowed to perform this action.') {
  return new AppError(message, 403, 'FORBIDDEN');
}

function invalid(message) {
  return new AppError(message, 400, 'VALIDATION_ERROR');
}

function conflict(message) {
  return new AppError(message, 409, 'CONFLICT');
}

function translatePrismaError(error) {
  if (error instanceof AppError) return error;
  if (error?.code === 'P2002') return conflict('A record with this value already exists.');
  if (error?.code === 'P2003') return conflict('This record is still referenced by related data.');
  if (error?.code === 'P2025') return notFound('Record');
  return error;
}

module.exports = { AppError, notFound, forbidden, invalid, conflict, translatePrismaError };

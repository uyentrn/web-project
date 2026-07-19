const { AppError, invalid } = require('../services/errors');
const { validate: isUUID } = require('uuid');

function body(req) {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    throw invalid('Request body must be a JSON object.');
  }
  return req.body;
}

function requiredString(value, field) {
  if (typeof value !== 'string' || !value.trim()) throw invalid(`${field} is required.`);
  return value.trim();
}

function optionalString(value, field) {
  if (value === undefined) return undefined;
  return requiredString(value, field);
}

function requiredPositiveInteger(value, field) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) throw invalid(`${field} must be a positive integer.`);
  return parsed;
}

function optionalNonNegativeInteger(value, field) {
  if (value === undefined) return undefined;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) throw invalid(`${field} must be a non-negative integer.`);
  return parsed;
}

function optionalPositiveInteger(value, field) {
  if (value === undefined) return undefined;
  return requiredPositiveInteger(value, field);
}

function id(value, field = 'ID') {
  //return requiredString(value, field);
  const result = requiredString(value, field);
  if (!isUUID(result)) {
    throw invalid(`${field} must be a valid UUID.`);
  }
  return result;
}

function authenticatedUser(req, { sessionRequired = false } = {}) {
  const userId = req.user?.id || req.auth?.sub;
  const sessionId = req.user?.sessionId || req.auth?.sid;
  if (!userId || (sessionRequired && !sessionId)) {
    throw new AppError('Authentication is required.', 401, 'UNAUTHENTICATED');
  }
  return { userId, sessionId };
}

function pagination(query = {}) {
  return {
    limit: optionalPositiveInteger(query.limit, 'Limit'),
    offset: optionalNonNegativeInteger(query.offset, 'Offset'),
  };
}

module.exports = {
  body,
  requiredString,
  optionalString,
  requiredPositiveInteger,
  optionalNonNegativeInteger,
  optionalPositiveInteger,
  id,
  authenticatedUser,
  pagination,
};

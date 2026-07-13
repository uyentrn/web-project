const { invalid } = require('../services/errors');

function validateRequest(validator) {
  if (typeof validator !== 'function') throw new Error('Validation middleware requires a validator function.');

  return async function validate(req, _res, next) {
    try {
      await validator(req);
      return next();
    } catch (error) {
      return next(error?.statusCode ? error : invalid('Request validation failed.'));
    }
  };
}

function requireJsonBody(req) {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    throw invalid('Request body must be a JSON object.');
  }
}

module.exports = { validateRequest, requireJsonBody };

const { AppError } = require('../services/errors');

function sendSuccess(res, data, statusCode = 200) {
  return res.status(statusCode).json({ status: 'success', data });
}

function sendEmptySuccess(res) {
  return sendSuccess(res, null);
}

function sendError(res, error) {
  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const message = error instanceof AppError ? error.message : 'An unexpected error occurred.';
  return res.status(statusCode).json({ status: 'error', message });
}

function handle(action) {
  return async (req, res) => {
    try {
      return await action(req, res);
    } catch (error) {
      return sendError(res, error);
    }
  };
}

module.exports = { sendSuccess, sendEmptySuccess, handle };

function createLoggerMiddleware(logger = console) {
  const write = typeof logger.info === 'function' ? logger.info.bind(logger) : console.info.bind(console);

  return function logRequest(req, res, next) {
    const startedAt = process.hrtime.bigint();
    res.on('finish', () => {
      const durationMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
      write({ method: req.method, path: req.path, statusCode: res.statusCode, durationMs: Number(durationMs.toFixed(2)) });
    });
    return next();
  };
}

module.exports = createLoggerMiddleware;

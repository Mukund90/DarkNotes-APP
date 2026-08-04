function requestLogger(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const durationMs = Date.now() - start;
    console.log(
      `[${req.correlationId}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${durationMs}ms)`
    );
  });

  next();
}

module.exports = requestLogger;

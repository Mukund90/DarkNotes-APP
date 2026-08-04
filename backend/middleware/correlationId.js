const crypto = require('crypto');

const CORRELATION_ID_HEADER = 'x-correlation-id';

function correlationIdMiddleware(req, res, next) {
  const incomingId = req.headers[CORRELATION_ID_HEADER];

  const isValid =
    typeof incomingId === 'string' &&
    incomingId.trim().length > 0 &&
    incomingId.length <= 100;

  const correlationId = isValid ? incomingId.trim() : crypto.randomUUID();

  req.correlationId = correlationId;
  res.setHeader('X-Correlation-ID', correlationId);

  next();
}

module.exports = correlationIdMiddleware;

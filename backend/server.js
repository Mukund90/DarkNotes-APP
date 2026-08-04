const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');
const correlationIdMiddleware = require('./middleware/correlationId');
const requestLogger = require('./middleware/requestLogger');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Correlation-ID'],
    exposedHeaders: ['X-Correlation-ID'],
  })
);
app.use(express.json());

app.use(correlationIdMiddleware);
app.use(requestLogger);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'DarkNotes Backend API is running',
    correlationId: req.correlationId,
  });
});

// Health endpoint (used by Kubernetes)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'darknotes-backend',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    correlationId: req.correlationId,
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

// 404 handler — still tagged with correlation ID for traceability
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    correlationId: req.correlationId,
  });
});

app.use((err, req, res, next) => {
  console.error(`[${req.correlationId}] Unhandled error:`, err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    correlationId: req.correlationId,
  });
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`DarkNotes Backend running on port ${PORT}`);
  });
}

module.exports = app;

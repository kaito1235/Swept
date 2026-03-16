const { NODE_ENV } = require('../config/app');

function errorHandler(err, req, res, next) {
  console.error(err.stack);

  const statusCode = err.statusCode || err.status || 500;
  const message = NODE_ENV === 'production' && statusCode === 500
    ? 'Internal server error'
    : err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(NODE_ENV !== 'production' && { stack: err.stack }),
  });
}

module.exports = errorHandler;

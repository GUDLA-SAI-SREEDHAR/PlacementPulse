const errorHandler = (err, req, res, next) => {
  console.error('[API Error]', err.stack || err.message || err);

  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let detail = err.message || 'Internal Server Error';

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    const fields = Object.keys(err.keyPattern || err.keyValue || {});
    detail = `A record with this ${fields.join(', ') || 'value'} already exists`;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    detail = Object.values(err.errors || {}).map((e) => e.message).join(', ') || err.message;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    detail = 'Invalid or expired authorization token';
  }

  res.status(statusCode).json({
    detail,
    message: detail,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;

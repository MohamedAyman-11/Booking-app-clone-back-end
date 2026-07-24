class AppError extends Error {
  constructor(statusCode, message, errors = undefined, code = undefined) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.errors = errors
    this.code = code
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
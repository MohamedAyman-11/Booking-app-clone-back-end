const AppError = require('../utils/appError')
// Handle Development Environment Errors
const handleDevErrors = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    err,
    stack: err.stack
  })
}
// Handle Production Environment Errors
const handleProductionError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      ...(err.errors && {errors: err.errors}),
      ...(err.code && {code: err.code})
    })
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong !',
    });
  }
}
// Handle Validator Error
const handleValidationError = (error) => {
  const errors = Object.values(error.errors).map(el => ({
    field: el.path,
    message: el.message,
    type: el.kind,
  }))
  return new AppError(400, 'Invalid input data', errors)
}
// Handle Duplicate Key Error
const handleDuplicationError = (error) => {
  const field = Object.keys(error.keyValue)[0];
  return new AppError(
    400,
    `${field.charAt(0).toUpperCase() + field.slice(1)} already exists. Please choose another one.`
  );
};
// Handle JWT Error
const handleJsonWebTokenError = () => {
  return new AppError(401, 'Invalid token! Please log in again!')
}
// Handle JWT Expires Error
const handleJsonWebTokenExpired = () => {
  return new AppError(401, 'Your token has expired! Please log in again!')
}
// Handle Duplicate Key
const handleDuplicateFieldsError = (err) => {
  const value = Object.values(err.keyValue)[0];
  const message = `Duplicate field value " ${value} ". Please use another value`;
  return new AppError(400, message);
};
// Handle Unhandled Route Errors
const unFoundRoute = (req, res, next) => {
  next(new AppError(404, `Can't find ${req.originalUrl} on this server`));
};
/**  ** Global Error Handler **  */
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    handleDevErrors(err, res)
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.create(err);
    // Validation Error
    if (error.name === 'ValidationError') error = handleValidationError(error);
    // Duplicate Value Error
    if (error.code === 11000) error = handleDuplicationError(error);
    // Token Verification Error
    if (error.name === 'JsonWebTokenError') handleJsonWebTokenError();
    // Token Expired Error
    if (error.name === 'TokenExpiredError') handleJsonWebTokenExpired();
    handleProductionError(error, res)
  }
}

module.exports = {unFoundRoute, globalErrorHandler}
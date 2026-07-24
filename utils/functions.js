const jwt = require('jsonwebtoken');
const { sendResetPasswordTemplate, sendRestoreAccountOtpTemplate } = require('./../views/templates');

const createJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_SECRET_KEY_EXPIRES_IN,
  });
};
// Send Reset Password HTML
const sendResetPasswordHtml = (resetUrl) => {
  return sendResetPasswordTemplate.replaceAll('<RESET_URL>', resetUrl);
};
// Send Restore Account HTML
const sendRestoreAccountOtpHtml = (otp) => {
  return sendRestoreAccountOtpTemplate.replaceAll('<OTP>', otp);
};
// Create And Send Token Via Cookie Handler
const createAndSendToken = (res, statusCode, status, user) => {
  const token = createJWT(user._id);
  res.cookie('jwt', token, {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });
  res.status(statusCode).json({
    status,
    data: { user },
    token,
  });
};
// Filter Property Body Data

const getPriceAfterDiscount = (price, discount) => {
  if (discount && discount > 0) {
    const safeDiscount = Math.min(Math.max(discount, 0), 100);
    return Math.round(price * (1 - safeDiscount / 100));
  }
  return price;
};
module.exports = {
  createJWT,
  sendResetPasswordHtml,
  createAndSendToken,
  sendRestoreAccountOtpHtml,
  getPriceAfterDiscount,
};

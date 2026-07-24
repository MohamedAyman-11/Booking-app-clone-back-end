const User = require('../models/userModel');
const authService = require('./../services/authService');
const {
  createJWT,
  createAndSendToken,
  sendResetPasswordHtml,
  sendRestoreAccountOtpHtml,
} = require('../utils/functions');
const sendEmail = require('../utils/email');
const AppError = require('../utils/appError');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { OAuth2Client } = require('google-auth-library');
const uploadImage = require('../utils/uploadToCloudinary');
const Email = require('../utils/email');
const register = async (req, res, next) => {
  const user = await authService.register(req.body, req.file);
  createAndSendToken(res, 201, 'success', user);
};
const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return next(new AppError(400, 'email and password are required!'));
  const user = await User.findOne({ email }).select('+password +active');
  if (user?.provider === 'google' && !user.password)
    return next(new AppError(400, 'This account uses Google Sign-In. Please continue with Google.'));
  if (!user || !(await user.isValidPassword(password, user.password)))
    return next(new AppError(401, 'Invalid email or password'));
  if (user && !user.active)
    return next(new AppError(403, 'Your account has been deactivated', undefined, 'ACCOUNT_DEACTIVATED'));
  createAndSendToken(res, 200, 'success', user);
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new AppError(400, 'Email is required!'));
  const user = await User.findOne({ email }).select('+active');
  if (!user) return next(new AppError(404, 'There is no user with that email address!'));
  if (!user.active)
    return next(new AppError(403, 'Your account has been deactivated', undefined, 'ACCOUNT_DEACTIVATED'));
  if (user.provider === 'google')
    return next(new AppError(400, 'Password reset is not available for Google accounts.'));
  const token = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  try {
    const resetUrl = `${process.env.ORIGIN}/reset-password/${token}`;
    const html = sendResetPasswordHtml(resetUrl);
    const email = new Email(user, resetUrl);
    await email.sendEmail(html, 'Reset your password');
    res.status(200).json({
      status: 'success',
      message: 'Password reset link sent successfully',
    });
  } catch (e) {
    user.passwordRST = undefined;
    user.passwordRSTExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError(500, 'There was an error sending the email! Pleas try again later.'));
  }
};

const resetPassword = async (req, res, next) => {
  if (!req.params.token) return next(new AppError(401, 'Token is required!'));
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({ passwordRST: hashedToken, passwordRSTExpires: { $gt: Date.now() } });
  if (!user) return next(new AppError(401, 'Password reset token is expired or invalid!'));
  user.password = req.body.password;
  user.passwordRST = undefined;
  user.passwordRSTExpires = undefined;
  await user.save();
  const jwt = createJWT(user._id);
  res.status(200).json({
    status: 'success',
    token: jwt,
  });
};

const sendOTP = async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new AppError(400, 'Email is required'));
  const user = await User.findOne({ email }).select('+active');
  if (!user) return next(new AppError(404, 'There is no user with that email address!'));
  if (user.active) return next(new AppError(400, 'This account is already active'));
  const otp = user.createOTP();
  await user.save();
  try {
    const html = sendRestoreAccountOtpHtml(otp);
    const activationEmail = new Email(user, otp);
    await activationEmail.sendEmail(html, 'Account Activation');
    res.status(200).json({
      status: 'success',
      message: 'A verification code has been sent to your email',
    });
  } catch (e) {
    user.OTP = undefined;
    user.OTPExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError(500, 'There was an error sending the email! Pleas try again later.'));
  }
};

const activateAccount = async (req, res, next) => {
  const { otp } = req.body;
  if (!otp) return next(new AppError(400, 'OTP is required'));
  const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');
  const user = await User.findOne({ OTP: hashedOTP, OTPExpires: { $gt: Date.now() } }).select('+active');
  if (!user) return next(new AppError(400, 'OTP is invalid or expired'));
  if (user.active) return next(new AppError(400, 'This account is already active. Please login in'));
  user.active = true;
  // Remove OTP Form DB
  user.OTP = undefined;
  user.OTPExpires = undefined;
  await user.save();
  res.status(200).json({
    status: 'success',
    message: 'Account activated successfully',
  });
};

const protect = async (req, res, next) => {
  const headers = req.headers;
  let token;
  if (headers.authorization && headers.authorization.startsWith('Bearer ')) token = headers.authorization.split(' ')[1];
  if (!token && req.cookies.jwt) token = req.cookies.jwt;
  if (!token) return next(new AppError(401, 'You are not logged in! Please log in to get access.'));
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) return next(new AppError(401, 'The user belonging to this token does no longer exist!'));
  if (freshUser.isExpiredToken(decoded.iat))
    return next(new AppError(401, 'User recently change password! Pleas login again'));
  req.user = freshUser;
  next();
};
const optionalProtect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decoded.id);

    req.user = user || null;

    next();
  } catch (err) {
    req.user = null;
    next();
  }
};
const logout = (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
};

const restrictTo = (...whitelist) => {
  return async (req, res, next) => {
    if (!whitelist.includes(req.user.role))
      return next(new AppError(403, `You don't have permission to perform this action!`));
    next();
  };
};

/* ** Google Auth ** */
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const googleAuth = async (req, res, next) => {
  const { credential } = req.body;
  if (!credential) return next(new AppError(400, 'Credential is required'));
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const { name, email, email_verified, sub, picture } = payload;
  if (!email_verified) return next(new AppError(400, 'Email not verified!'));
  let user = await User.findOne({ email }).select('+active');
  if (!user) {
    user = await User.create({
      name,
      email,
      googleId: sub,
      provider: 'google',
      photo: {
        url: picture,
      },
    });
  }
  if (user && user.provider === 'local')
    return next(new AppError(400, 'This email is already registered with email and password. Please login normally.'));
  if (!user.active)
    return next(new AppError(403, 'Your account has been deactivated', undefined, 'ACCOUNT_DEACTIVATED'));
  createAndSendToken(res, 200, 'success', user);
};
module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  protect,
  logout,
  restrictTo,
  googleAuth,
  activateAccount,
  sendOTP,
  optionalProtect,
};

const User = require('../models/userModel');
const Review = require('../models/reviewModel');
const Property = require('../models/propertyModel');
const AppError = require('../utils/appError');
const { sendRestoreAccountOtpHtml, createAndSendToken } = require('../utils/functions');
const sendEmail = require('../utils/email');
const crypto = require('crypto');
const deleteImage = require('../utils/deleteImage');
const uploadImage = require('../utils/uploadToCloudinary');
// Get Me
const getMe = async (req, res) => {
  res.status(200).json({
    status: 'success',
    data: { user: req.user },
  });
};
// Delete My Account
const deleteMe = async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.clearCookie('jwt');
  res.status(200).json({
    status: 'success',
    message: 'Account deactivated successfully',
  });
};

// Update My Data
const updateMyData = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  user.name = req.body.name ?? user.name;
  if (req.file) {
    const imageData = await uploadImage(req.file.buffer);
    if (user?.photo?.public_id) {
      await deleteImage(user.photo.public_id);
    }
    user.photo = {
      url: imageData.url,
      public_id: imageData.public_id,
    };
  }
  await user.save();
  createAndSendToken(res, 200, 'success', user);
};

// Update My Password
const updateMyPassword = async (req, res, next) => {
  const currentUser = req.user;
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword)
    return next(new AppError(400, 'Current password and new Password are required'));
  const user = await User.findById(currentUser._id).select('+password');
  if (user.googleId) return next(new AppError(400, 'Password changes are not available for Google accounts.'));
  if (!(await user.isValidPassword(currentPassword, user.password)))
    return next(new AppError(401, 'Your current password is wrong!'));
  if (currentPassword === newPassword)
    return next(new AppError(400, 'New password must be different from current password'));
  user.password = newPassword;
  await user.save();
  createAndSendToken(res, 200, 'success', user);
};

// Become A host
const becomeHost = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) return next(new AppError(401, 'You are not logged in. Please login first'));
  if (user.role === 'host') return next(new AppError(400, 'You are already host.'));
  user.role = 'host';
  await user.save();
  res.status(200).json({
    status: 'success',
    message: 'You are now a host.',
  });
};

module.exports = {
  deleteMe,
  getMe,
  updateMyData,
  updateMyPassword,
  becomeHost,
};

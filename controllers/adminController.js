const { getReviewsStats, getUsersStats, getPropertiesStats } = require('../services/dashboardService');
const User = require('./../models/userModel');
const AppError = require('../utils/appError');
const Property = require('./../models/propertyModel');
const Saved = require('./../models/savedModel');
const ApiFeatures = require('./../utils/apiFeatures');
const Review = require('../models/reviewModel');
// 1 ) Get Stats
const getAdminStats = async (req, res) => {
  // 1 ) Get Properties Statistics
  const propertiesStats = await getPropertiesStats();
  // 2 ) Get Users Statistics
  const usersStats = await getUsersStats();
  // 3 ) Get Reviews Statistics
  const reviewsStats = await getReviewsStats();
  // Send Response
  res.status(200).json({
    status: 'success',
    data: {
      stats: {
        propertiesStats,
        usersStats,
        reviewsStats,
      },
    },
  });
};
// Get All Users
const getAllUsers = async (req, res) => {
  const features = new ApiFeatures(User.find(), req.query).filter().sort().fields().pagination();
  const users = await features.query;
  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
};
// Get All Properties
const getAllProperties = async (req, res) => {
  const features = new ApiFeatures(Property.find(), req.query).filter().sort().fields().pagination();
  const properties = await features.query;
  res.status(200).json({
    status: 'success',
    data: {
      properties,
    },
  });
};
// Delete Property
const deleteProperty = async (req, res) => {
  await Saved.deleteMany({ property: id });
  await Review.deleteMany({ property: id });
  await Property.findByIdAndDelete(id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
// Accept or Reject Property
const changePropertyStatus = async (req, res, next) => {
  const allowedStatus = ['accepted', 'rejected'];
  const id = req.params.id;
  const { status, rejectReason } = req.body;
  if (!allowedStatus.includes(status)) {
    return next(new AppError(400, 'Invalid property status'));
  }
  const property = await Property.findById(id);
  if (!property) return next(new AppError(400, 'No property exist with that id'));
  if (status === 'accepted') {
    property.status = 'accepted';
    property.rejectReason = undefined;
  }
  if (status === 'rejected' && !rejectReason) {
    return next(new AppError(400, 'Please add property reject reason'));
  }
  if (status === 'rejected') {
    property.status = 'rejected';
    property.rejectReason = rejectReason;
  }
  await property.save();
  res.status(200).json({
    status: 'success',
    message: 'Property status changed successfully',
    data: {
      property,
    },
  });
};
// Toggle User Status (Active | Inactive)
const toggleUserStatus = async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) return next(new AppError(404, 'No user found with that id'));
  if (user.active) {
    user.active = false;
    await user.save();
    return res.status(200).json({
      status: 'success',
      message: 'User deactivated successfully',
    });
  }
  user.active = true;
  await user.save();
  res.status(200).json({
    status: 'success',
    message: 'User activated successfully',
  });
};
module.exports = {
  getAdminStats,
  getAllUsers,
  getAllProperties,
  changePropertyStatus,
  toggleUserStatus,
  deleteProperty,
};

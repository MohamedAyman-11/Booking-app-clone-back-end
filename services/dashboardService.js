const User = require('../models/userModel');
const Property = require('../models/propertyModel');
const Review = require('../models/reviewModel');
// Get Users Stats
const getUsersStats = async () => {
  const usersStats = await User.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        users: {
          $sum: { $cond: [{ $eq: ['$role', 'user'] }, 1, 0] },
        },
        hosts: {
          $sum: { $cond: [{ $eq: ['$role', 'host'] }, 1, 0] },
        },
        admins: {
          $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] },
        },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);
  return usersStats[0] || { total: 0, users: 0, hosts: 0, admins: 0 };
};
// Get Properties Statistics
const getPropertiesStats = async () => {
  const [stats] = await Property.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        pending: {
          $sum: {
            $cond: [{ $eq: ['$status', 'pending'] }, 1, 0],
          },
        },
        accepted: {
          $sum: {
            $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0],
          },
        },
        rejected: {
          $sum: {
            $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        total: 1,
        pending: 1,
        accepted: 1,
        rejected: 1,
      },
    },
  ]);
  return (
    stats || {
      pending: 0,
      total: 0,
      rejected: 0,
      accepted: 0,
    }
  );
};
// Get Review Statistics
const getReviewsStats = async () => {
  return await Review.countDocuments();
};
module.exports = {
  getPropertiesStats,
  getReviewsStats,
  getUsersStats,
};

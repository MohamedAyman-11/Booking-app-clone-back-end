const Review = require('../models/reviewModel')
const Booking = require('../models/bookingModel')
const Property = require("../models/propertyModel");
const AppError = require('../utils/appError')
const ApiFeatures = require('../utils/apiFeatures')
const mongoose = require("mongoose");
// Get Reviews
const getAllReviews = async (req, res) => {
// * ) GET ALL REVIEWS FOR ALL PROPERTIES OR ONE PROPERTY
  let filterObj = {};
  if (req.params.propertyId) filterObj = {property: req.params.propertyId}
  const features = new ApiFeatures(Review.find(filterObj),req.query).filter().sort().fields().pagination()
  const reviews = await features.query.populate('property')
  res.status(200).json({
    status: "success",
    result: reviews.length,
    data: {
      reviews
    }
  })
}

// Create Review
const createReview = async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user._id;
  if (!req.body.property) req.body.property = req.params.propertyId;
  const booking = await Booking.exists({
    user: req.user._id,
    property: req.body.property,
    status: "confirmed",
    paymentStatus: "paid"
  });

  if (!booking) {
    return next(
      new AppError(403, "You can only review properties you have booked.")
    );
  }
  const review = await Review.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      review
    }
  })
}
// Get My Reviews
const getUserReviews = async (req, res) => {
  const userId = req.user._id;
  const features = new ApiFeatures(Review.find({user: userId}), req.query).filter().sort().fields().pagination()
  const reviews = await features.query.populate('property');
  res.status(200).json({
    status: 'success',
    result: reviews.length,
    data: {
      reviews
    }
  })
}
// Update Reviews
const updateReview = async (req, res) => {
  const {id} = req.params;
  const updatedReview = await Review.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    returnDocument: 'after'
  })
  res.status(200).json({
    status: 'success',
    data: {
      review: updatedReview
    }
  })
}
// Delete Review
const deleteReview = async (req, res) => {
  const {id} = req.params;
  await Review.findByIdAndDelete(id);
  res.status(204).json({
    status: 'success',
    data: null
  })
}
// GetHostReviews
const getHostReviews = async (req, res) => {
  const properties = await Property.find({host: req.user._id}).select("_id");
  const propertyIds = properties.map((property) => property._id);
  const features = new ApiFeatures(Review.find({property: {$in: propertyIds}}), req.query).filter().sort().fields().pagination()
  const reviews = await features.query.populate('property')
  res.status(200).json({
    status: 'success',
    result: reviews.length,
    data: {
      reviews,
    }
  })
}
// Get Reviews Stats
const getPropertyReviewsStats = async (propertyId) => {
  return await Review.aggregate([
    {
      $match: {property: new mongoose.Types.ObjectId(propertyId)}
    },
    {
      $group: {
        _id: null,
        overAllRating: {$avg: '$overAllRating'},
        cleanliness: {$avg: "$categories.cleanliness"},
        location: {$avg: "$categories.location"},
        accuracy: {$avg: "$categories.accuracy"},
        check_in: {$avg: "$categories.check_in"},
        communication: {$avg: "$categories.communication"},
        value: {$avg: "$categories.value"},
        ratingsQuantity: {$sum: 1}
      }
    }
  ])
}
module.exports = {
  getAllReviews,
  createReview,
  getUserReviews,
  updateReview,
  deleteReview,
  getPropertyReviewsStats,
  getHostReviews
}
const express = require('express');
const {
  getAllReviews,
  createReview,
  updateReview,
  deleteReview, getHostReviews,
} = require("../controllers/reviewsController");
const {protect, restrictTo} = require("../controllers/authController");
const {getUserReviews} = require("../controllers/reviewsController");

const router = express.Router({mergeParams: true});

router.route('/').get(protect,restrictTo('admin'),getAllReviews).post(protect, restrictTo('user'), createReview)
router.get('/me', protect, restrictTo('user'), getUserReviews)
router.get('/host/me', protect, restrictTo('host'), getHostReviews)
router.route('/:id').patch(protect, restrictTo('user', 'admin'), updateReview).delete(protect, restrictTo('user', 'admin'), deleteReview)
module.exports = router
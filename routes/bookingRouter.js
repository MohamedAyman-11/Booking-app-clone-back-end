const express = require('express');
const { createBooking, getAllBookings } = require('../controllers/bookingController');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router();

router.route('/').post(protect, restrictTo('user'), createBooking).get(protect, getAllBookings);

module.exports = router;

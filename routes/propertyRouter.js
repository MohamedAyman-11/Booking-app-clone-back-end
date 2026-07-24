const express = require('express');
const reviewRouter = require("../routes/reviewRouter");
const {
  getAllProperties, createProperty,
  getMyProperties, getProperty, updateProperty, deleteProperty
} = require("../controllers/propertyController");
const {protect, restrictTo, optionalProtect} = require("../controllers/authController");
const upload = require("../middlewares/upload");
//*******************************************************************************************
//*******************************************************************************************
const router = express.Router();
router.route('/').get(optionalProtect, getAllProperties).post(protect, restrictTo('host'), upload.array('images', 5), createProperty)
router.get('/me', protect, restrictTo('host'), getMyProperties)
router.route('/:id').get(optionalProtect, getProperty).patch(protect, upload.array('images'), restrictTo('host'), updateProperty).delete(protect, restrictTo('host', 'admin'), deleteProperty)
router.use('/:propertyId/reviews', reviewRouter)

module.exports = router;
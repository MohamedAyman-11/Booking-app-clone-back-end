const express = require('express');
const { protect } = require('../controllers/authController');
const { getSavedProperty, saveProperty, removeSavedProperty } = require('../controllers/savedPropertyController');
const router = express.Router();
router.use(protect);
router.route('/').get(getSavedProperty).post(saveProperty);
router.route('/:id').delete(removeSavedProperty);
module.exports = router;

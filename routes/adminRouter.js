const express = require('express');
const {
  getAdminStats,
  getAllUsers,
  getAllProperties,
  changePropertyStatus,
  toggleUserStatus,
} = require('../controllers/adminController');
const { restrictTo, protect } = require('../controllers/authController');
const router = express.Router();
router.use(protect, restrictTo('admin'));
router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.get('/properties', getAllProperties);
router.patch('/properties/:id/status', changePropertyStatus);
router.patch('/users/:id/toggleStatus', toggleUserStatus);
module.exports = router;

const upload = require('../middlewares/upload');
const express = require('express');
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  logout,
  googleAuth,
  sendOTP,
  activateAccount,
} = require('../controllers/authController');
const router = express.Router();
router.post('/register', upload.single('photo'), register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/google', googleAuth);
router.post('/sendOtp', sendOTP);
router.post('/activate-account', activateAccount);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
module.exports = router;

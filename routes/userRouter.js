const express = require('express')
const upload = require('./../middlewares/upload')
const {
  deleteMe,
  getMe,
  updateMyData,
  updateMyPassword, becomeHost, getUsersStats
} = require("../controllers/userController");
const {protect} = require("../controllers/authController");
const router = express.Router();

router.use(protect)
router.route('/me').get(getMe).delete(deleteMe).patch(upload.single('photo'), updateMyData)
router.patch('/myPassword', updateMyPassword)
router.patch('/become-host', becomeHost)

module.exports = router
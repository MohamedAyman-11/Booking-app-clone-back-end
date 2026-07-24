const multer = require('multer')
const AppError = require('../utils/appError')

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb(new AppError(400, 'Only images are allowed'), false);
  }
}
const upload = multer({storage, fileFilter});

module.exports = upload
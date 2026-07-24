const User = require('../models/userModel');
const uploadImage = require('../utils/uploadToCloudinary');
const AppError = require('../utils/appError');
const register = async (userData, file) => {
  const {name, email, password} = userData;
  const existingUser = await User.findOne({email}).select('+active');
  if (existingUser && !existingUser.active) throw new AppError(403, 'Your account has been deactivated', undefined, 'ACCOUNT_DEACTIVATED')
  if (existingUser?.provider === 'google') throw new AppError(400, 'This email is already registered with Google. Please sign in with Google.')
  if (existingUser) throw new AppError(400, 'Email already exists');
  let photo;
  if (file) {
    const {url, public_id} = await uploadImage(file.buffer, 'user');
    photo = {
      url,
      public_id
    }
  }
  return User.create({name, email, password, ...(photo && {photo})});
}
module.exports = {
  register
}
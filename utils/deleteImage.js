const cloudinary = require('cloudinary').v2

const deleteImage = async (public_id) => {
  try {
    if (!public_id) return;
    await cloudinary.uploader.destroy(public_id)
  } catch (e) {
    console.log(e)
  }
}
module.exports = deleteImage
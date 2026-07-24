const cloudinary = require('./cloudinary');
const streamifier = require('streamifier')

const uploadImage = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({
      folder: `booking/${folder}`,
    }, (error, result) => {
      if (error) return reject(error);
      resolve(result)
    })
    streamifier.createReadStream(buffer).pipe(stream)
  })
}
module.exports = uploadImage
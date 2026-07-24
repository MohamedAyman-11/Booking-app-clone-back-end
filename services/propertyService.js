const Property = require('../models/propertyModel');
const Saved = require('../models/savedModel');
const mongoose = require('mongoose');
const AppError = require('../utils/appError');
const { getPropertyReviewsStats } = require('../controllers/reviewsController');
const uploadImage = require('../utils/uploadToCloudinary');
const deleteImage = require('../utils/deleteImage');

const getAllProperties = async (user) => {
  const properties = await Property.find({ status: 'accepted' });
  const activeProperties = properties.filter((prop) => prop.host.active);
  if (!user) return activeProperties;

  const saved = await Saved.find({ user: user.id });
  const savedIds = new Set(saved.map((el) => el.property.toString()));
  return activeProperties.map((property) => ({
    ...property.toObject(),
    isSaved: savedIds.has(property._id.toString()),
  }));
};

const getProperty = async (propertyId, user) => {
  if (!mongoose.Types.ObjectId.isValid(propertyId)) throw new AppError(400, 'Invalid property id');
  const property = await Property.findById(propertyId).populate('reviews');
  if (!property) throw new AppError(404, 'No property found with that id');
  const stats = await getPropertyReviewsStats(propertyId);
  if (!user) return { property, stats, isSaved: false };
  const isSaved = !!(await Saved.exists({
    property: propertyId,
    user: user.id,
  }));
  return { property, stats, isSaved };
};
const preparePropertyData = async (propertyData, files, user) => {
  const {
    name,
    description,
    propertyType,
    pricePerNight,
    country,
    city,
    discount,
    bathrooms,
    bedrooms,
    guests,
    stars,
    beds,
    amenities,
  } = propertyData;
  if (!files || files.length < 5) throw new AppError(400, 'Please upload 5 image.');
  const images = await Promise.all(files.map((file) => uploadImage(file.buffer, 'properties')));
  return {
    name,
    description,
    propertyType,
    pricePerNight,
    discount,
    bathrooms,
    guests,
    stars,
    beds,
    amenities,
    bedrooms,
    location: {
      city,
      country,
    },
    host: user.id,
    images: images.map(({ url, public_id }) => ({ url, public_id })),
  };
};
const preparePropertyUpdateData = async (propertyData, files, user) => {
  const {
    name,
    description,
    propertyType,
    pricePerNight,
    country,
    city,
    discount,
    bathrooms,
    bedrooms,
    guests,
    stars,
    beds,
    amenities,
  } = propertyData;
  const existingImages = JSON.parse(propertyData.existingImages || '[]');
  const deletedImages = JSON.parse(propertyData.deletedImages || '[]');
  // Delete Old Images
  if (deletedImages?.length) await Promise.all(deletedImages.map((id) => deleteImage(id)));
  let images = [];
  // Upload New Images
  if (files?.length) images = await Promise.all(files.map((file) => uploadImage(file.buffer, 'properties')));
  const updatedImages = [...(existingImages || []), ...images.map(({ url, public_id }) => ({ url, public_id }))];
  delete propertyData.deletedImages;
  delete propertyData.existingImages;
  return {
    name,
    description,
    propertyType,
    pricePerNight,
    discount,
    bathrooms,
    bedrooms,
    guests,
    stars,
    beds,
    amenities,
    location: {
      city,
      country,
    },
    host: user._id,
    images: updatedImages,
    status: 'pending',
  };
};
const adminPropertiesStats = async (hostId) => {
  const statsResult = await Property.aggregate([
    {
      $match: { host: hostId },
    },
    {
      $group: {
        _id: null,
        pending: {
          $sum: {
            $cond: [{ $eq: ['$status', 'pending'] }, 1, 0],
          },
        },
        accepted: {
          $sum: {
            $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0],
          },
        },
        rejected: {
          $sum: {
            $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0],
          },
        },
        total: { $sum: 1 },
      },
    },
    {
      $project: { _id: 0 },
    },
  ]);
  return (
    statsResult[0] || {
      accepted: 0,
      rejected: 0,
      pending: 0,
      total: 0,
    }
  );
};
module.exports = {
  getAllProperties,
  getProperty,
  preparePropertyData,
  preparePropertyUpdateData,
  adminPropertiesStats,
};

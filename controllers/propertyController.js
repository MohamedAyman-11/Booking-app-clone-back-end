const Property = require('../models/propertyModel');
const Saved = require('../models/savedModel');
const AppError = require('../utils/appError');
const propertyService = require('../services/propertyService');
const deleteImage = require('../utils/deleteImage');
const ApiFeatures = require('./../utils/apiFeatures');
const Review = require('../models/reviewModel');
const getAllProperties = async (req, res) => {
  const properties = await propertyService.getAllProperties(req.user);
  res.status(200).json({
    status: 'success',
    result: properties.length,
    data: {
      properties,
    },
  });
};
const getProperty = async (req, res) => {
  const { stats, isSaved, property } = await propertyService.getProperty(req.params.id, req.user);
  res.status(200).json({
    status: 'success',
    data: {
      property: {
        ...property.toObject(),
        isSaved,
        stats,
      },
    },
  });
};
const createProperty = async (req, res) => {
  const propertyData = await propertyService.preparePropertyData(req.body, req.files, req.user);
  const property = await Property.create(propertyData);
  res.status(201).json({
    status: 'success',
    data: {
      property,
    },
  });
};
const updateProperty = async (req, res, next) => {
  const propertyData = await propertyService.preparePropertyUpdateData(req.body, req.files, req.user);
  const property = await Property.findOneAndUpdate({ _id: req.params.id, host: req.user._id }, propertyData, {
    runValidators: true,
    returnDocument: 'after',
  });
  if (!property) return next(new AppError(404, 'Property not found'));
  res.status(200).json({
    status: 'success',
    data: {
      property,
    },
  });
};
// Delete Property
const deleteProperty = async (req, res, next) => {
  const property = await Property.findByIdAndDelete(req.params.id);
  if (!property) return next(new AppError(404, 'No property found with that id'));
  await Promise.all(property.images.map((img) => deleteImage(img.public_id)));
  await Saved.deleteMany({ property: req.params.id });
  await Review.deleteMany({ property: req.params.id });
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
// Get My Properties
const getMyProperties = async (req, res) => {
  const hostId = req.user._id;
  const queryObj = { ...req.query, host: hostId };
  const features = new ApiFeatures(Property.find(), queryObj).filter().sort().fields().pagination();
  const properties = await features.query.populate({
    path: 'reviews',
    select: 'user rating message -property',
  });

  const stats = propertyService.adminPropertiesStats(hostId);
  res.status(200).json({
    status: 'success',
    results: properties.length,
    data: {
      properties,
      stats,
    },
  });
};

module.exports = {
  getAllProperties,
  createProperty,
  getProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
};

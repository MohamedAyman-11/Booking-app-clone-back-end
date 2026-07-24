const Saved = require('../models/savedModel');
const AppError = require('../utils/appError');
const getSavedProperty = async (req, res) => {
  const properties = await Saved.find({ user: req.user._id }).populate({
    path: 'property',
  });
  res.status(200).json({
    status: 'success',
    result: properties.length,
    data: {
      properties,
    },
  });
};
const saveProperty = async (req, res, next) => {
  req.body.user = req.user._id;
  const property = await Saved.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      property,
    },
  });
};
const removeSavedProperty = async (req, res) => {
  let deleteOptions = { property: req.params.id, user: req.user._id };
  await Saved.findOneAndDelete(deleteOptions);
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
module.exports = { getSavedProperty, saveProperty, removeSavedProperty };

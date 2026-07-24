const mongoose = require('mongoose');

const savedSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Saved property is required'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);
savedSchema.index({ user: 1, property: 1 }, { unique: true });

module.exports = mongoose.model('Saved', savedSchema);

const mongoose = require('mongoose')
const Property = require('../models/propertyModel')

const reviewSchema = new mongoose.Schema({
  overAllRating: {
    type: Number,
    min: 1,
    max: 5,
    default: 4.5,
    required: [true, 'Rating can not be empty'],
  },
  categories: {
    cleanliness: {
      type: Number,
      min: 0.5,
      max: 5,
    },
    accuracy: {
      type: Number,
      min: 0.5,
      max: 5,
    },
    check_in: {
      type: Number,
      min: 0.5,
      max: 5,
    },
    communication: {
      type: Number,
      min: 0.5,
      max: 5,
    },
    location: {
      type: Number,
      min: 0.5,
      max: 5,
    },
    value: {
      type: Number,
      min: 0.5,
      max: 5,
    },
  },
  message: {
    type: String,
    required: [true, 'Review message can not be empty']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must be belonging to user']
  },
  property: {
    type: mongoose.Schema.ObjectId,
    ref: 'Property',
    required: [true, 'Review must be belonging to property']
  }
}, {
  timestamps: true
})
reviewSchema.index({property: 1, user: 1}, {unique: true});
reviewSchema.pre(/^find/, function () {
  this.populate({
    path: 'user',
    select: 'name picture email'
  })
})

reviewSchema.statics.calcReviews = async function (propertyId) {
  const stats = await this.aggregate([
    {
      $match: {property: propertyId}
    },
    {
      $group: {
        _id: 'property',
        ratingsQuantity: {$sum: 1},
        averageRating: {$avg: '$overAllRating'}
      }
    }
  ])
  if (stats.length > 0) {
    await Property.findByIdAndUpdate(propertyId, {
      ratingsQuantity: stats[0].ratingsQuantity,
      averageRating: stats[0].averageRating,
    })
  } else {
    await Property.findByIdAndUpdate(propertyId, {
      ratingsQuantity: 0,
      averageRating: 0,
    })
  }
}
reviewSchema.post('save', function () {
  this.constructor.calcReviews(this.property)
})
reviewSchema.pre(/^findOneAnd/, async function () {
  this.doc = await this.model.findOne(this.getFilter());
})
reviewSchema.post(/^findOneAnd/, async function () {
  if (this.doc) {
    await this.doc.constructor.calcReviews(this.doc.property);
  }
})

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review
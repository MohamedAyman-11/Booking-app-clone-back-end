const mongoose = require('mongoose');
const propertySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 8,
      maxlength: 80,
      trim: true,
      required: [true, 'Property name is required'],
    },
    stars: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Property stars are required'],
    },
    propertyType: {
      type: String,
      enum: ['Hotel', 'Apartment', 'Villa'],
      required: [true, 'Property type is required'],
    },
    description: {
      type: String,
      minlength: 40,
      maxlength: 1000,
      trim: true,
      required: [true, 'Property description is required'],
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Property price per night is required'],
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    guests: {
      type: Number,
      required: [true, 'Property guests number are required'],
      min: 1,
    },
    bedrooms: {
      type: Number,
      min: 1,
      required: [true, 'Property bedrooms number are required'],
    },
    beds: {
      type: Number,
      required: [true, 'Property beds number are required'],
      min: 1,
    },
    bathrooms: {
      type: Number,
      required: [true, 'Property bathrooms number are required'],
      min: 1,
    },
    images: {
      type: [
        {
          url: {
            type: String,
            required: true,
          },
          public_id: {
            type: String,
            required: true,
          },
        },
      ],
      validate: {
        validator: (arr) => arr.length >= 5,
        message: 'Property must have at least 5 images',
      },
    },
    amenities: [
      {
        type: String,
        required: [true, 'Property amenities are required'],
        enum: [
          'Wifi',
          'Parking',
          'Pool',
          'AirConditioning',
          'TV',
          'Kitchen',
          'Laundry',
          'Gym',
          'Pets',
          'Breakfast',
          'Restaurant',
          'RoomService',
          'FamilyRooms',
          'NonSmokingRooms',
          'AirportShuttle',
          'TeaCoffeeMaker',
          'Garden',
          'Beachfront',
          'Accessible',
        ],
        validate: {
          validator: (arr) => arr.length > 0,
          message: 'Property must have at least one amenity',
        },
      },
    ],
    location: {
      city: {
        type: String,
        required: [true, 'Property city is required'],
      },
      country: {
        type: String,
        required: [true, 'Property country is required'],
      },
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    rejectReason: String,
    host: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
propertySchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'property',
  localField: '_id',
});
propertySchema.pre(/^find/, function () {
  this.populate({
    path: 'host',
    select: '-__v -passwordUpdatedAt -provider -role',
  });
});
module.exports = mongoose.model('Property', propertySchema);

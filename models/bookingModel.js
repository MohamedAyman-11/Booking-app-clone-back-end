const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Booking must belong to a user.'],
    },

    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Booking must belong to a property.'],
    },

    checkIn: {
      type: Date,
      required: [true, 'Check-in date is required.'],
    },

    checkOut: {
      type: Date,
      required: [true, 'Check-out date is required.'],
    },

    guests: {
      type: Number,
      required: [true, 'Number of guests is required.'],
      min: [1, 'Guests must be at least 1.'],
    },

    pricePerNight: {
      type: Number,
      required: [true, 'Price per night is required.'],
    },

    totalPrice: {
      type: Number,
      required: [true, 'Total price is required.'],
    },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed'],
      default: 'pending',
    },

    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded'],
      default: 'unpaid',
    },
    expiresAt: {
      type: Date,
      index: {
        expires: 0,
      },
    },
    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

bookingSchema.index({ user: 1 });
bookingSchema.index({ property: 1 });

module.exports = mongoose.model('Booking', bookingSchema);

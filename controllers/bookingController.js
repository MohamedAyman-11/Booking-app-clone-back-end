const Booking = require('../models/bookingModel');
const Property = require('../models/propertyModel');
const AppError = require('../utils/appError');
const stripe = require('../utils/stripe');
const { getPriceAfterDiscount } = require('../utils/functions');
const ApiFeatures = require('../utils/apiFeatures');

const createBooking = async (req, res, next) => {
  const property = await Property.findOne({ _id: req.body.property, status: 'accepted' });
  if (!property) return next(new AppError(404, 'Property not found'));
  const checkIn = new Date(req.body.checkIn);
  const checkOut = new Date(req.body.checkOut);
  if (checkIn >= checkOut) return next(new AppError(400, 'Check out must be after check in'));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (checkIn < today) return next(new AppError(400, 'Check in cannot be in the past'));
  if (req.body.guests > property.guests) return next(new AppError(400, 'Too many guests'));
  const existingBooking = await Booking.findOne({
    property: property._id,
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn },
  });
  if (existingBooking) return next(new AppError(400, 'Property is not available'));
  if (property.host.toString() === req.user._id.toString())
    return next(new AppError(400, "You can't book your own property"));
  const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  const priceAfterDiscount = getPriceAfterDiscount(property.pricePerNight, property.discount);
  const totalPrice = nights * priceAfterDiscount;
  const booking = await Booking.create({
    property: property._id,
    user: req.user._id,
    checkIn,
    checkOut,
    totalPrice,
    guests: req.body.guests,
    pricePerNight: priceAfterDiscount,
    expiresAt: new Date(Date.now() + 1000 * 60 * 15),
  });
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: totalPrice * 100,
          product_data: {
            name: property.name,
            description: `Accommodation booking from ${checkIn.toLocaleDateString()} to ${checkOut.toLocaleDateString()} • ${nights} night${nights > 1 ? 's' : ''} • ${req.body.guests} guest${req.body.guests > 1 ? 's' : ''} • Total Price: EGP ${totalPrice}`,
            images: [property.images[0].url],
          },
        },
      },
    ],
    success_url: `${process.env.ORIGIN}/payment-success`,
    cancel_url: `${process.env.ORIGIN}/payment-success`,
    metadata: {
      bookingId: booking._id.toString(),
    },
  });
  res.status(201).json({
    status: 'success',
    paymentUrl: session.url,
  });
};
const getAllBookings = async (req, res) => {
  let filterObj = {};
  if (req.user.role === 'user') {
    filterObj = { user: req.user._id };
  } else if (req.user.role === 'host') {
    const properties = (await Property.find({ host: req.user._id })).map((prop) => prop._id);
    filterObj = { property: { $in: properties } };
  }
  const features = new ApiFeatures(Booking.find(filterObj), req.query).filter().sort().fields().pagination();
  const bookings = await features.query
    .populate('user')
    .populate('property', 'name images location pricePerNight propertyType');
  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: { bookings },
  });
};
module.exports = { createBooking, getAllBookings };

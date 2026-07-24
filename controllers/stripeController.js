const stripe = require('../utils/stripe')
const Booking = require('../models/bookingModel');
const AppError = require('../utils/appError');
const stripeWebhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET_KEY)
  } catch (e) {
    return next(new AppError(400, `Webhook Error: ${e.message}`))
  }
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    if (session.payment_status === 'paid') {
      const bookingId = session.metadata.bookingId;
      const booking = await Booking.findById(bookingId);
      if (booking) {
        booking.status = 'confirmed';
        booking.paymentStatus = 'paid';
        booking.paidAt = new Date();
        booking.expiresAt = undefined
        await booking.save();
      }
    }
  }
  res.status(200).json({received: true});
}

module.exports = {stripeWebhook}
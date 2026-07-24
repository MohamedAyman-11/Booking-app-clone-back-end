const Booking = require('../../models/bookingModel');
const cron = require('node-cron');

cron.schedule('* * * * *', async () => {
  await Booking.updateMany(
    {
      status: 'confirmed',
      checkOut: { $lt: new Date() },
    },
    {
      status: 'completed',
    },
  );
});

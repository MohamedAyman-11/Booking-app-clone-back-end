// Packages
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('@exortek/express-mongo-sanitize');

// Routes
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const propertyRouter = require('./routes/propertyRouter');
const reviewRouter = require('./routes/reviewRouter');
const savedRouter = require('./routes/savedPropertyRouter');
const adminRouter = require('./routes/adminRouter');
const bookingRouter = require('./routes/bookingRouter');
const stripeRouter = require('./routes/stripeRouter');

// Error Handlers
const { unFoundRoute, globalErrorHandler } = require('./controllers/globalErrorHandler');
const app = express();
app.set('query parser', 'extended');
app.use(helmet());
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  }),
);
const API_PREFIX = '/api/v1';
app.use(`${API_PREFIX}/stripe`, stripeRouter);
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(mongoSanitize());

app.use(`${API_PREFIX}/auth`, authRouter);
app.use(`${API_PREFIX}/user`, userRouter);
app.use(`${API_PREFIX}/admin`, adminRouter);
app.use(`${API_PREFIX}/properties`, propertyRouter);
app.use(`${API_PREFIX}/reviews`, reviewRouter);
app.use(`${API_PREFIX}/saved`, savedRouter);
app.use(`${API_PREFIX}/bookings`, bookingRouter);

app.use(unFoundRoute);
app.use(globalErrorHandler);
module.exports = app;

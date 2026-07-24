# Full-Stack Booking Clone API

<div align="center">
  <img src="https://via.placeholder.com/1200x320.png?text=Booking+Platform+API" alt="Booking Platform API Banner" />
</div>

<div align="center">
  <img src="https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&style=for-the-badge" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-5.x-000000?logo=express&style=for-the-badge" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas%20%2F%20Local-47A248?logo=mongodb&style=for-the-badge" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Mongoose-9.x-880000?logo=mongodb&style=for-the-badge" alt="Mongoose" />
  <img src="https://img.shields.io/badge/JWT-Authentication-4E46B4?logo=jsonwebtokens&style=for-the-badge" alt="JWT" />
  <img src="https://img.shields.io/badge/Stripe-Payments-635BFF?logo=stripe&style=for-the-badge" alt="Stripe" />
  <img src="https://img.shields.io/badge/Cloudinary-Uploads-3448C5?logo=cloudinary&style=for-the-badge" alt="Cloudinary" />
  <img src="https://img.shields.io/badge/Google%20OAuth-Sign%20In-4285F4?logo=google&style=for-the-badge" alt="Google OAuth" />
  <img src="https://img.shields.io/badge/License-ISC-blue.svg" alt="License" />
  <img src="https://img.shields.io/badge/Version-1.0.0-blue.svg" alt="Version" />
</div>

<p align="center"><strong>A production-ready backend for a modern accommodation booking platform with authentication, property management, booking flows, reviews, moderation, and Stripe payments.</strong></p>

---

## 📚 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#-folder-structure)
- [Environment Variables](#-environment-variables)
- [Installation](#-installation)
- [Available Scripts](#-available-scripts)
- [Running Locally](#-running-locally)
- [REST API Overview](#-rest-api-overview)
- [Authentication Flow](#-authentication-flow)
- [Booking Flow](#-booking-flow)
- [Property Moderation Flow](#-property-moderation-flow)
- [Payment Flow](#-payment-flow)
- [Security Features](#-security-features)
- [Future Improvements](#-future-improvements)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## 🌐 Overview

This repository contains the backend API for a booking marketplace inspired by modern hospitality platforms. It powers:

- user registration and authentication
- host-managed property listings
- property discovery and saved-listing workflows
- review and rating systems
- booking creation and payment checkout
- admin moderation for listings and users

The application is implemented as a modular Node.js + Express service with MongoDB and Mongoose, organized around routes, controllers, services, models, and reusable utilities.

---

## ✨ Features

### Core Platform Features

- ✅ User registration, login, logout, and JWT-based session handling
- ✅ Google OAuth sign-in support
- ✅ Password reset and account activation flows via email
- ✅ Role-based access for users, hosts, and admins
- ✅ Host onboarding through role promotion

### Property Features

- ✅ Property creation with image uploads
- ✅ Property updates and deletion
- ✅ Property listing details including location, price, amenities, bedrooms, guests, and discounts
- ✅ Property moderation states: pending, accepted, rejected
- ✅ Host-specific property management and stats

### Discovery & Interaction

- ✅ Browse accepted properties
- ✅ Save properties to a personal saved-list
- ✅ View property details with review statistics
- ✅ Submit and manage property reviews
- ✅ Review aggregation updates property average rating and review count

### Booking & Payment

- ✅ Booking availability checks for property dates
- ✅ Booking creation with pricing and guest validation
- ✅ Stripe Checkout integration for payment initiation
- ✅ Webhook-based booking confirmation on successful payment
- ✅ Automated booking status transition to completed after checkout

### Admin Operations

- ✅ Admin dashboard statistics for users, properties, and reviews
- ✅ Admin user activation/deactivation
- ✅ Admin property approval and rejection with reason tracking

---

## 🏗️ Architecture

The project follows a layered backend architecture:

- `routes/` defines API endpoints
- `controllers/` handles request logic and response formatting
- `services/` contains core business workflows such as property preparation and dashboard stats
- `models/` defines the MongoDB schema layer using Mongoose
- `middlewares/` handles request-level concerns such as file upload handling
- `utils/` centralizes email delivery, image uploads, Stripe integration, error handling, and token utilities
- `src/cron/` runs scheduled background tasks

This structure keeps the API maintainable and extensible for future frontend integration or additional services.

---

## 🛠️ Tech Stack

| Area         | Technology                 |
| ------------ | -------------------------- |
| Runtime      | Node.js                    |
| Framework    | Express.js                 |
| Database     | MongoDB                    |
| ODM          | Mongoose                   |
| Auth         | JWT + Cookies              |
| Payments     | Stripe                     |
| File Uploads | Multer + Cloudinary        |
| Email        | Nodemailer + SendGrid      |
| OAuth        | Google OAuth               |
| Security     | Helmet, CORS, Sanitization |
| Scheduling   | node-cron                  |

---

## 📁 Folder Structure

```text
.
├── controllers/
│   ├── adminController.js
│   ├── authController.js
│   ├── bookingController.js
│   ├── globalErrorHandler.js
│   ├── propertyController.js
│   ├── reviewsController.js
│   ├── savedPropertyController.js
│   ├── stripeController.js
│   └── userController.js
├── middlewares/
│   └── upload.js
├── models/
│   ├── bookingModel.js
│   ├── propertyModel.js
│   ├── reviewModel.js
│   ├── savedModel.js
│   └── userModel.js
├── routes/
│   ├── adminRouter.js
│   ├── authRouter.js
│   ├── bookingRouter.js
│   ├── propertyRouter.js
│   ├── reviewRouter.js
│   ├── savedPropertyRouter.js
│   ├── stripeRouter.js
│   └── userRouter.js
├── services/
│   ├── authService.js
│   ├── dashboardService.js
│   └── propertyService.js
├── src/
│   └── cron/
│       └── bookingStatus.js
├── utils/
│   ├── apiFeatures.js
│   ├── appError.js
│   ├── cloudinary.js
│   ├── deleteImage.js
│   ├── email.js
│   ├── functions.js
│   ├── stripe.js
│   └── uploadToCloudinary.js
├── views/
│   └── templates.js
├── app.js
├── package.json
├── server.js
└── config.env
```

---

## ⚙️ Environment Variables

| Variable                    | Purpose                                    |
| --------------------------- | ------------------------------------------ |
| `DATABASE`                  | MongoDB connection string                  |
| `DATABASE_PASSWORD`         | Password for the MongoDB connection        |
| `PORT`                      | Server port                                |
| `JWT_SECRET_KEY`            | Secret key for JWT generation              |
| `JWT_SECRET_KEY_EXPIRES_IN` | JWT expiration duration                    |
| `ORIGIN`                    | Allowed frontend origin                    |
| `SMTP_USER`                 | SMTP username for email delivery           |
| `EMAIL_FROM`                | Sender email address                       |
| `SENDGRID_PASSWORD`         | SendGrid password / API key                |
| `COOKIE_EXPIRES_IN`         | JWT cookie lifetime in days                |
| `GOOGLE_CLIENT_ID`          | Google OAuth client ID                     |
| `CLOUDINARY_CLOUD_NAME`     | Cloudinary account name                    |
| `CLOUDINARY_API_KEY`        | Cloudinary API key                         |
| `CLOUDINARY_API_SECRET`     | Cloudinary API secret                      |
| `STRIPE_PUBLIC_KEY`         | Stripe public key                          |
| `STRIPE_SECRET_KEY`         | Stripe secret key                          |
| `STRIPE_WEBHOOK_SECRET_KEY` | Stripe webhook verification secret         |
| `OTP_EXPIRES`               | OTP expiration window in minutes           |
| `PASSWORD_RESET_EXPIRES`    | Password reset token expiration in minutes |
| `BCRYPT_ROUNDS`             | Password hashing cost factor               |

---

## 🚀 Installation

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)
- Cloudinary account
- Stripe account
- SendGrid or SMTP access

### Steps

```bash
git clone <your-repo-url>
cd full-stack-booking-clone
npm install
```

Create a `config.env` file and populate it using the variables above.

---

## ▶️ Available Scripts

| Script           | Command              | Purpose                           |
| ---------------- | -------------------- | --------------------------------- |
| Development      | `npm start`          | Starts the server with nodemon    |
| Production-style | `npm run start:prod` | Starts the app in production mode |

---

## 🧪 Running Locally

```bash
npm start
```

The application will run on:

```text
http://localhost:3000
```

---

## 📡 REST API Overview

| Resource   | Method   | Endpoint                                 | Purpose                     |
| ---------- | -------- | ---------------------------------------- | --------------------------- |
| Auth       | `POST`   | `/api/v1/auth/register`                  | Register a new user         |
| Auth       | `POST`   | `/api/v1/auth/login`                     | Sign in                     |
| Auth       | `POST`   | `/api/v1/auth/logout`                    | Clear auth cookie           |
| Auth       | `POST`   | `/api/v1/auth/google`                    | Google OAuth login          |
| Auth       | `POST`   | `/api/v1/auth/forgotPassword`            | Request reset link          |
| Auth       | `PATCH`  | `/api/v1/auth/resetPassword/:token`      | Reset password              |
| User       | `GET`    | `/api/v1/user/me`                        | Get current profile         |
| User       | `PATCH`  | `/api/v1/user/me`                        | Update profile              |
| User       | `DELETE` | `/api/v1/user/me`                        | Deactivate account          |
| User       | `PATCH`  | `/api/v1/user/myPassword`                | Change password             |
| User       | `PATCH`  | `/api/v1/user/become-host`               | Promote account to host     |
| Properties | `GET`    | `/api/v1/properties`                     | List accepted properties    |
| Properties | `POST`   | `/api/v1/properties`                     | Create property (host only) |
| Properties | `GET`    | `/api/v1/properties/me`                  | List host properties        |
| Properties | `GET`    | `/api/v1/properties/:id`                 | Get property details        |
| Properties | `PATCH`  | `/api/v1/properties/:id`                 | Update property             |
| Properties | `DELETE` | `/api/v1/properties/:id`                 | Delete property             |
| Reviews    | `POST`   | `/api/v1/properties/:propertyId/reviews` | Create review               |
| Reviews    | `GET`    | `/api/v1/properties/:propertyId/reviews` | List reviews for property   |
| Reviews    | `GET`    | `/api/v1/reviews/me`                     | List current user reviews   |
| Reviews    | `GET`    | `/api/v1/reviews/host/me`                | List host-related reviews   |
| Saved      | `GET`    | `/api/v1/saved`                          | List saved properties       |
| Saved      | `POST`   | `/api/v1/saved`                          | Save a property             |
| Saved      | `DELETE` | `/api/v1/saved/:id`                      | Remove saved property       |
| Bookings   | `POST`   | `/api/v1/bookings`                       | Create a booking            |
| Bookings   | `GET`    | `/api/v1/bookings`                       | List bookings               |
| Admin      | `GET`    | `/api/v1/admin/stats`                    | Dashboard stats             |
| Admin      | `GET`    | `/api/v1/admin/users`                    | List users                  |
| Admin      | `GET`    | `/api/v1/admin/properties`               | List properties             |
| Admin      | `PATCH`  | `/api/v1/admin/properties/:id/status`    | Approve or reject property  |
| Admin      | `PATCH`  | `/api/v1/admin/users/:id/toggleStatus`   | Activate or deactivate user |
| Stripe     | `POST`   | `/api/v1/stripe/webhook`                 | Payment webhook             |

---

## 🔐 Authentication Flow

1. User registers or logs in through the auth routes.
2. The server issues a JWT and sets it as an HTTP-only cookie.
3. Protected routes validate the token using middleware.
4. Role-based checks allow access to host and admin-only resources.
5. Password reset and OTP-based account recovery are supported.

---

## 🧾 Booking Flow

1. A user submits property availability data with check-in and check-out dates.
2. The server validates guest count, date range, and property existence.
3. If the property is available, a booking record is created.
4. The server initiates a Stripe Checkout session for payment.
5. A successful payment triggers the webhook and confirms the booking.

---

## 🏠 Property Moderation Flow

1. A host creates or updates a property listing.
2. The property is stored with status `pending` by default.
3. An admin reviews and changes the status to `accepted` or `rejected`.
4. Rejection can include a reason that is persisted on the property record.
5. Only accepted properties appear in the public listing flow.

---

## 💳 Payment Flow (Stripe)

1. Booking creation builds a Stripe Checkout session.
2. The session includes booking metadata and payment details.
3. The user completes checkout on Stripe.
4. Stripe sends a webhook event to `/api/v1/stripe/webhook`.
5. The booking is updated to `confirmed` and `paid` when the payment succeeds.

---

## 🛡️ Security Features

- JWT-based authentication with cookie-based storage
- Role-based authorization for users, hosts, and admins
- Helmet and CORS protection
- Mongo sanitization to prevent NoSQL injection patterns
- Input validation and structured error handling
- Secure image uploads through Cloudinary
- Password hashing with bcrypt

---

<div align="center">
  <img src="https://via.placeholder.com/800x220.png?text=Screenshot+Placeholder" alt="Screenshot Placeholder" />
</div>

---

## 🧩 API Docs & Tooling

- API Documentation: `TODO: Add Swagger/OpenAPI docs`
- Postman Collection: `TODO: Add Postman workspace`
- ER Diagram: `TODO: Add database schema diagram`

---

## 🔮 Future Improvements

- Add Swagger/OpenAPI documentation
- Add automated tests and CI/CD pipeline
- Add pagination and filtering enhancements
- Introduce webhook retry and idempotency handling
- Add admin analytics and reporting views
- Expand property search and recommendation logic

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run the local server and verify behavior
5. Submit a pull request with a clear summary

Please keep the codebase clean, documented, and consistent with the existing architecture.

---

## 📄 License

This project is licensed under the ISC License.

---

## 👤 Author

- Name: Mohamed Ayman
- Email: mhmd.ayman.0101@gmail.com
- GitHub: @your-github-username
- LinkedIn: linkedin.com/in/your-profile

---

<p align="center">Built with care for scalable backend architecture, clean API design, and real-world booking workflows.</p>

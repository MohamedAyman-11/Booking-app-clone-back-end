# Full-Stack Booking Platform API

A production-ready Node.js and Express backend for a modern accommodation booking platform, designed to support property discovery, host management, user authentication, reviews, saved listings, bookings, and secure payments.

## Overview

This repository contains the server-side application for a booking marketplace inspired by modern hospitality platforms. It provides a scalable REST API for managing users, properties, reviews, saved items, bookings, and payment checkout flows.

The project is built with a modular architecture that separates routing, business logic, services, and data models, making it suitable for extension into a full client-server product or integration with a frontend application.

## Key Features

### User and Access Management

- Secure user registration and login
- JWT-based authentication with cookie support
- Google Sign-In integration
- Role-based access control for users, hosts, and admins
- Password reset and account activation workflows

### Property Management

- Create, update, and delete property listings
- Upload and manage multiple property images
- Support for property details such as pricing, location, amenities, and capacity
- Property moderation lifecycle with pending, accepted, and rejected states

### Discovery and Interaction

- Browse approved properties
- Save favorite properties for later
- View individual property details with review statistics
- Review and rating support for properties

### Booking and Payments

- Availability checks for booking requests
- Dynamic pricing and discount handling
- Stripe checkout integration for secure online payments
- Booking records for users and host-related property activity

### Reliability and Security

- Input validation and error handling
- Security middleware for request protection
- Sanitization for safer API usage
- Cloudinary-based media storage for uploaded images

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Stripe for payments
- Cloudinary for image uploads
- Multer for file handling
- Nodemailer / SendGrid for email delivery
- Google OAuth for social sign-in
- dotenv for environment management

## Architecture Overview

The application follows a clean layered structure:

- Routes define the API endpoints
- Controllers handle HTTP requests
- Services encapsulate core business logic
- Models define the MongoDB data schema
- Utilities provide reusable helper functions for payments, uploads, emails, and errors

This separation makes the codebase easier to maintain, test, and scale as new features are added.

## Installation and Setup

### Prerequisites

- Node.js 18+ recommended
- MongoDB instance (local or Atlas)
- Cloudinary account
- Stripe account
- SendGrid or SMTP provider

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd full-stack-booking-clone
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create or update the `config.env` file with the required values:

```env
DATABASE=your_mongodb_connection_string
DATABASE_PASSWORD=your_database_password
PORT=3000
JWT_SECRET_KEY=your_jwt_secret
JWT_SECRET_KEY_EXPIRES_IN=90d
ORIGIN=http://localhost:5173
SMTP_USER=apikey
EMAIL_FROM=your_email
SENDGRID_PASSWORD=your_sendgrid_password
COOKIE_EXPIRES_IN=90
GOOGLE_CLIENT_ID=your_google_client_id
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET_KEY=your_stripe_webhook_secret
OTP_EXPIRES=5
PASSWORD_RESET_EXPIRES=5
BCRYPT_ROUNDS=12
```

> Replace the placeholder values with your actual credentials before running the app.

## Running the Project Locally

Start the development server:

```bash
npm start
```

The API will be available at:

```text
http://localhost:3000
```

For production-style execution:

```bash
npm run start:prod
```

## Usage Guide

### Authentication

- Register a new account using email/password
- Log in to receive a JWT token and set a cookie-based session
- Use the password reset flow for forgotten credentials

### Host Workflow

- Create a host account
- Upload property details and at least five images
- Manage the property listing through the API
- Review booking activity and property status

### User Workflow

- Browse approved properties
- Save properties to a personal list
- Create bookings and complete payment through Stripe
- Leave reviews for properties

### Admin Workflow

- Manage property approval/rejection states
- Review platform activity and moderation actions

## Folder Structure

```text
controllers/      # Request handlers and business logic
models/           # Mongoose schemas and database models
routes/            # API route definitions
services/          # Reusable service-layer logic
middlewares/       # Custom middleware such as uploads
utils/             # Helper functions for emails, uploads, payments, and errors
src/cron/          # Scheduled background tasks
views/             # Template-related resources
```

---

## 👤 Author

|              | Details                                                        |
| ------------ | -------------------------------------------------------------- |
| **Name**     | Mohamed Ayman                                                  |
| **GitHub**   | [MohamedAyman-11](https://github.com/MohamedAyman-11)          |
| **LinkedIn** | [Mohamed Ayman](https://www.linkedin.com/in/mohamedayman-dev/) |
| **Email**    | master.mohamed.ayman@gmail.com                                 |

---

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [8, 'Name must be at least 8 characters'],
      trim: true,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      validate: [validator.isEmail, 'Invalid email'],
      lowercase: true,
      unique: true,
      trim: true,
    },
    photo: {
      public_id: {
        type: String,
        default: null,
      },
      url: {
        type: String,
        default: null,
      },
    },
    provider: {
      type: String,
      required: [true, 'Login provider is required'],
      enum: ['google', 'local'],
      default: 'local',
    },
    googleId: String,
    password: {
      type: String,
      minlength: [8, 'Password must be at least 8 character'],
      select: false,
      required: function () {
        return this.provider === 'local';
      },
    },
    passwordUpdatedAt: Date,
    role: {
      type: String,
      enum: ['admin', 'host', 'user'],
      default: 'user',
    },
    active: {
      type: Boolean,
      default: true,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    otp: String,
    otpExpires: Date,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
// Create Restore Account OTP
userSchema.methods.createOTP = function () {
  const otp = crypto.randomInt(100000, 1000000).toString();
  this.otp = crypto.createHash('sha256').update(otp).digest('hex');
  this.otpExpires = Date.now() + process.env.OTP_EXPIRES * 60 * 1000;
  return otp;
};
// Verify Password Handler
userSchema.methods.isValidPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
// Create Password Reset Token Handler
userSchema.methods.createPasswordResetToken = function () {
  const token = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
  this.passwordResetExpires = Date.now() + process.env.PASSWORD_RESET_EXPIRES * 60 * 1000;
  return token;
};
// Create Verify Token Expired
userSchema.methods.isExpiredToken = function (tokenTimeStamp) {
  if (this.passwordUpdatedAt) {
    const passwordUpdatedAt = parseInt(this.passwordUpdatedAt.getTime() / 1000, 10);
    return passwordUpdatedAt > tokenTimeStamp;
  }
  return false;
};
// Encrypt Password Before Save
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, process.env.BCRYPT_ROUNDS);
});
// Set Password Update Date
userSchema.pre('save', function () {
  if (!this.isModified('password') || this.isNew) return;
  this.passwordUpdatedAt = Date.now() - 1000;
});

module.exports = mongoose.model('User', userSchema);

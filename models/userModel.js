const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must have a name'],
    trim: true,
    unique: true,
    maxLength: [40, 'User name must have less or equal than 40 characters'],
    minLength: [10, 'User name must have more or equal than 10 characters'],
    // validate: [validator.isAlpha, 'Name can ony contain characters'],
    validate: {
      validator: (val) => validator.isAlpha(val, ['en-US'], { ignore: ' ' }),
      message: 'Name can only contain characters',
    },
  },
  email: {
    type: String,
    required: [true, 'User must have an email'],
    trim: true,
    unique: [true, 'User already exists with this email'],
    lowercase: true,
    validate: [
      validator.isEmail,
      'Must be an email in a similar format to test@test.com',
    ],
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'User must have a password'],
    minLength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'User must confirm password'],
    minLength: 8,
    validate: {
      validator: function (el) {
        return el === this.password
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
})

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  this.password = await bcrypt.hash(this.password, 12)
  this.passwordConfirm = undefined

  next()
})

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next()

  this.passwordChangedAt = Date.now() - 1000
  next()
})

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } })
  next()
})

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)

    return JWTTimestamp < changedTimestamp
  }

  // false means not changed
  return false
}

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex')

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000

  return resetToken
}

const User = mongoose.model('User', userSchema)

module.exports = User

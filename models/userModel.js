const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

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
  password: {
    type: String,
    required: [true, 'User must have a password'],
    minLength: 8,
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
})

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  this.password = await bcrypt.hash(this.password, 12)
  this.passwordConfirm = undefined

  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User

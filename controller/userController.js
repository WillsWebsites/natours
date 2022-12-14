const User = require('../models/userModel')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')

const filterObj = (obj, ...allowedFields) => {
  const newObj = {}
  Object.keys(obj).forEach((o) => {
    if (allowedFields.includes(o)) newObj[o] = obj[o]
  })
  return newObj
}

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find()

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  })
})

exports.updateMe = catchAsync(async (req, res, next) => {
  // Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /update-my-password',
        400
      )
    )
  }

  // Filter out unwanted fieldnames that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email')

  // Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  })
})

exports.deleteMe = catchAsync(async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { active: false })

  res.status(204).json({
    status: 'success',
    data: null,
  })
})

exports.addUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: `This route isn't created yet`,
  })
}

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: `This route isn't created yet`,
  })
}

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: `This route isn't created yet`,
  })
}

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: `This route isn't created yet`,
  })
}

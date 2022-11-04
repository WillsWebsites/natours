const AppError = require('../utils/appError')

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`
  return new AppError(message, 400)
}

const handleDuplicateFieldsErrorDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]
  const message = `Duplicate field value: ${value}. Please use another value`
  return new AppError(message, 400)
}

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message)
  const message = `Invalid data: ${errors.join(', ')}`
  return new AppError(message, 400)
}

const sendErrorDev = (err, res) => {
  console.log('error')
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  })
}

const sendErrorProd = (err, res) => {
  // Operational error
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    })

    // Programming error or other unkown error
  } else {
    console.error('ERROR: ', err)
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    })
  }
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'
  if (process.env.NODE_ENV === 'dev') {
    sendErrorDev(err, res)
  } else if (process.env.NODE_ENV === 'prod') {
    let error = Object.create(err)

    if (err.name === 'CastError') error = handleCastErrorDB(error)
    if (err.code === 11000) error = handleDuplicateFieldsErrorDB(error)
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error)

    sendErrorProd(error, res)
  }
}

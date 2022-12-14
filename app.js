const express = require('express')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')

const AppError = require('./utils/appError')
const GlobalErrorHandler = require('./controller/errorController')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const app = express()

// Global Middleware
app.use(helmet())

if (process.env.NODE_ENV === 'dev') {
  app.use(morgan('dev'))
}

const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour',
})

app.use('/api', limiter)

app.use(express.json({ limit: '10kb' }))

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize())

// Data Sanitization against XSS
app.use(xss())

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuatintity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
)

app.use(express.static(`${__dirname}/public`))

app.use((req, _, next) => {
  req.requestTime = new Date().toISOString()
  next()
})

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

app.all('*', (req, _, next) => {
  next(new AppError(`Couldn't find the requested route: ${req.originalUrl}`, 404))
})

app.use(GlobalErrorHandler)

module.exports = app

const express = require('express')
const morgan = require('morgan')
const AppError = require('./utils/appError')
const GlobalErrorHandler = require('./controller/errorController')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const app = express()

// Middleware
console.log(process.env.NODE_ENV)

if (process.env.NODE_ENV === 'dev') {
  app.use(morgan('dev'))
}

app.use(express.json())

app.use(express.static(`${__dirname}/public`))

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

app.all('*', (req, res, next) => {
  next(new AppError(`Couldn't find the requested route: ${req.originalUrl}`, 404))
})

app.use(GlobalErrorHandler)

module.exports = app

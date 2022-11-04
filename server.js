const mongoose = require('mongoose')
const dotenv = require('dotenv')

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception. Shutting Down...')
  console.log(err.name, err.message)
  process.exit(1)
})

dotenv.config({ path: './config.env' })

const DB = process.env.MONGO_URI

const start = async () => {
  try {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
  } catch (error) {
    console.error(error)
  }
}

start()
const app = require('./app')

const port = process.env.PORT || 3000

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`)
})

process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection. Shutting Down...')
  console.log(err.name, err.message)
  server.close(() => {
    process.exit(1)
  })
})

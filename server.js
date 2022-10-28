const mongoose = require('mongoose')
const dotenv = require('dotenv')

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

app.listen(port, () => {
  console.log(`App running on port ${port}...`)
})

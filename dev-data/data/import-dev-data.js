const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Tour = require('../../models/tourModel')

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

    const tours = JSON.parse(
      fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
    )

    const importData = async () => {
      await Tour.create(tours)
      console.log('data successfully loaded')
      process.exit()
    }

    const deleteAllData = async () => {
      await Tour.deleteMany()
      console.log('data successfully deleted')
      process.exit()
    }

    if (process.argv[2] === '--import') {
      importData()
    } else if (process.argv[2] === '--delete') {
      deleteAllData()
    }
  } catch (error) {
    console.error(error)
  }
}

start()

/* eslint-disable prefer-object-spread */
const Tour = require('../models/tourModel')
const APIFeatures = require('../utils/apiFeatures')

// Route Handlers

exports.topTours = (req, res, next) => {
  req.query.limit = 4
  req.query.sort = '-ratingsAverage,price'
  req.query.fields = 'name,price,ratingsAverage,summary'
  next()
}

exports.getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate()

    const tours = await features.query

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    })
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    })
  }
}

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)
    res.status(200).json({
      status: 'success',
      results: tour.length,
      data: {
        tour,
      },
    })
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: 'No tour was found',
    })
  }
}

exports.addTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body)

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    })
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: `Invalid data sent: ${err}`,
    })
  }
}

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    console.log(tour)

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    })
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: `Couldn't find the tour or couldn't update the tour`,
    })
  }
}

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id)
    res.status(204).json({
      status: 'success',
      message: 'tour successfully deleted',
    })
  } catch (err) {
    res.send(404).json({
      status: 'failed',
      message: `Couldn't delete tour: ${err}`,
    })
  }
}

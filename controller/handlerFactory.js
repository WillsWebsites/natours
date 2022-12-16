const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const APIFeatures = require('../utils/apiFeatures')

exports.deleteOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const modelName = Model.modelName.toLowerCase()
    const doc = await Model.findByIdAndDelete(req.params.id)

    if (!doc) {
      return next(new AppError(`No ${modelName} found with that ID`, 404))
    }
    res.status(204).json({
      status: 'success',
      message: `${Model.modelName} deleted`,
      data: null,
    })
  })
}

exports.updateOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const modelName = Model.modelName.toLowerCase()
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!doc) {
      return next(new AppError(`No ${modelName} found with that ID`, 404))
    }

    res.status(200).json({
      status: 'success',
      message: `${Model.modelName} updated`,
      data: {
        [modelName]: doc,
      },
    })
  })
}

exports.createOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const modelName = Model.modelName.toLowerCase()
    const doc = await Model.create(req.body)

    res.status(201).json({
      status: 'success',
      message: `${Model.modelName} created`,
      data: {
        [modelName]: doc,
      },
    })
  })
}

exports.getOne = (Model, populateOptions) => {
  return catchAsync(async (req, res, next) => {
    const modelName = Model.modelName.toLowerCase()

    let query = Model.findById(req.params.id)
    if (populateOptions) query = query.populate(populateOptions)
    const doc = await query

    if (!doc) {
      return next(new AppError(`No ${modelName} found with that ID`, 404))
    }

    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        [modelName]: doc,
      },
    })
  })
}

exports.getAll = (Model) => {
  return catchAsync(async (req, res, next) => {
    // allows nested GET reviews on tour (hacky)
    let filter = {}
    if (req.params.tourId) filter = { tour: req.params.tourId }

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate()

    const modelName = Model.modelName.toLowerCase()
    const docs = await features.query

    if (!docs) {
      return next(new AppError(`No ${modelName}'s found with that ID`, 404))
    }

    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        [modelName]: docs,
      },
    })
  })
}

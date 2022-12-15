const express = require('express')
const tourController = require('../controller/tourController')
const authController = require('../controller/authController')
const reviewRouter = require('./reviewRoutes')

const router = express.Router()

// Routes
router.use('/:tourId/reviews', reviewRouter)

router.route('/top-5-tours').get(tourController.topTours, tourController.getAllTours)

router.route('/tour-stats').get(tourController.getTourStats)
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan)

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.addTour)

router
  .route('/:id')
  .patch(tourController.updateTour)
  .get(tourController.getTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  )

module.exports = router

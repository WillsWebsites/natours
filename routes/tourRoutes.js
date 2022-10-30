const express = require('express')
const tourController = require('../controller/tourController')

const router = express.Router()

// Routes
router.route('/top-5-tours').get(tourController.topTours, tourController.getAllTours)

router.route('/tour-stats').get(tourController.getTourStats)
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan)

router.route('/').get(tourController.getAllTours).post(tourController.addTour)

router
  .route('/:id')
  .patch(tourController.updateTour)
  .get(tourController.getTour)
  .delete(tourController.deleteTour)

module.exports = router

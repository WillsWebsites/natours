const express = require('express')
const viewController = require('../controller/viewController')

const router = express.Router()

router.get('/', viewController.getOverview)
router.get('/tour/:slug', viewController.getTour)
router.get('/login', viewController.login)

module.exports = router

const express = require('express')
const userController = require('../controller/userController')
const authController = require('../controller/authController')

const router = express.Router()

// Routes
router.post('/signup', authController.signUp)
router.post('/login', authController.login)
router.post('/forgot-password', authController.forgotPassword)
router.patch('/reset-password/:token', authController.resetPassword)

// All routes after this are protected
router.use(authController.protect)

router.patch('/update-my-password', authController.updatePassword)
router.get('/me', userController.getMe, userController.getUser)
router.patch(
  '/update-me',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
)
router.delete('/delete-me', userController.deleteMe)

// All routes after this can only be adjusted by admins
router.use(authController.restrictTo('admin'))

router.route('/').get(userController.getAllUsers).post(userController.addUser)
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser)

module.exports = router

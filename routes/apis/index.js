<<<<<<< HEAD
const router = require('express').Router()
=======
const express = require('express')
const router = express.Router()

const passport = require('passport')
const userController = require('../../controllers/user-controller')
const { authenticatedAdmin, authenticated } = require('../../middleware/api-auth')
const adminController = require('../../controllers/admin-controller')
>>>>>>> master
const users = require('./user')
const admin = require('./admin')
const passport = require('passport')
const { authenticated } = require('../../middleware/api-auth')
const userController = require('../../controllers/user-controller')
const { apiErrorHandler } = require('../../middleware/error-handler')

<<<<<<< HEAD
router.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  next()
})
router.post('/users/', userController.signUp)
router.post(
  '/users/login',
  passport.authenticate('local', {
    session: false,
    failureMessage: true,
    failWithError: true
  }),
  userController.signIn,
  userController.signInFail
)

router.use('/users', authenticated, users)
router.use('/admin', admin)
=======
router.post('/users', userController.signUp)
router.post('/admin/login', passport.authenticate('local', { session: false, failureMessage: true, failWithError: true }), adminController.signIn, adminController.signInFail)
router.post('/users/login', passport.authenticate('local', { session: false, failureMessage: true, failWithError: true }), userController.signIn, userController.signInFail)

router.use('/admin', authenticated, authenticatedAdmin, admin)
router.use('/users', authenticated, users)

>>>>>>> master

router.use('/', apiErrorHandler)
module.exports = router

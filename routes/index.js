const express = require('express')
const router = express.Router()
const user = require('./modules/user')

const passport = require('../config/passport')
const userController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../middleware/authentication')
const { RegisterValidator } = require('../middleware/validator-handler')

router.post('/api/users/login', passport.authenticate('local', { session: false }), userController.signIn)

router.post('/api/users', RegisterValidator, userController.signUp)

// modules
router.use('/api/users', authenticated, authenticatedUser, user)

// not found router
router.use('/', (_, res, next) => {
  res.status(404).json({
    status: 'error',
    message: 'Page not found'
  })
  next()
})

// error handler
router.use('/', generalErrorHandler)

module.exports = router

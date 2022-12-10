const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../middleware/authentication')
const { RegisterValidator } = require('../middleware/validator-handler')
const tweetController = require('../controllers/tweet-controller')

router.use('/api/tweets', authenticated, authenticatedUser, tweetController)
router.post('/api/signin', passport.authenticate('local', { session: false }), userController.signIn)

router.post('/api/signup', RegisterValidator, userController.signUp)

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

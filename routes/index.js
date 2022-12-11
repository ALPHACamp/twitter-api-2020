const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controllers/user-controller')
// const tweetController=require('../controllers/tweet-controller')
const tweet = require('./modules/tweet')
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../middleware/authentication')
const { RegisterValidator } = require('../middleware/validator-handler')

router.post('/api/signin', passport.authenticate('local', { session: false }), userController.signIn)

router.post('/api/signup', RegisterValidator, userController.signUp)

router.use('/api/tweets', authenticated, authenticatedUser, tweet)

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

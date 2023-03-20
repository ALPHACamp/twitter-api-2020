const express = require('express')
const router = express.Router()
const passport = require('passport')
const tweet = require('./modules/tweet')
const { apiErrorHandler } = require('../middleware/error-handler')
const userController = require('../controllers/user-controller')
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../middleware/auth')

router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/signup', userController.signUp)
router.use('/', (req, res) => {
  res.json('api test')
})
router.get('/', (req, res) => {
  res.json('Hello world')
})
router.use('/tweets', tweet)
router.use('/', apiErrorHandler)

module.exports = router

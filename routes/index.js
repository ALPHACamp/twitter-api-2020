const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const { apiErrorHandler } = require('../middleware/error-handler')
const { authenticatedUser } = require('../middleware/auth')

const user = require('./modules/user')
const tweet = require('./modules/tweet')
const followship = require('./modules/followship')

const userController = require('../controllers/user-controller')

router.use('/users', authenticatedUser, user)
router.use('/tweets', authenticatedUser, tweet)
router.use('/followships', authenticatedUser, followship)

router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)

router.use('/', apiErrorHandler)

module.exports = router

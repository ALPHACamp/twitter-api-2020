const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const { apiErrorHandler } = require('../middleware/error-handler')
const { authenticatedUser, authenticatedAdmin } = require('../middleware/auth')

const user = require('./modules/user')
const tweet = require('./modules/tweet')
const followship = require('./modules/followship')
const admin = require('./modules/admin')

const userController = require('../controllers/user-controller')

router.use('/users', user)
router.use('/tweets', authenticatedUser, tweet)
router.use('/followships', authenticatedUser, followship)
router.use('/admin', authenticatedAdmin, admin)

router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)

router.use('/', apiErrorHandler)

module.exports = router

const express = require('express')
const router = express.Router()
const { apiErrorHandler } = require('../../middleware/error-handler')
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../../middleware/api-auth')
const userController = require('../../controllers/apis/user-controller')
const passport = require('../../config/passport')
const user = require('./modules/user')
const admin = require('./modules/admin')
const followship = require('./modules/followship')
const tweet = require('./modules/tweet')

// for user login
router.post('/signin', passport.authenticate('local', { session: false }), authenticatedUser, userController.signIn)
// for admin login
router.post('/admin/signin', passport.authenticate('local', { session: false }), authenticatedAdmin, userController.signIn)
router.use('/users', user)
router.use('/admin', authenticated, authenticatedAdmin, admin)
router.use('/followships', authenticated, authenticatedUser, followship)
router.use('/tweets', authenticated, authenticatedUser, tweet)
router.use('/', apiErrorHandler)

module.exports = router

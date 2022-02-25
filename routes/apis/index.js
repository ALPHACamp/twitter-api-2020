const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const admin = require('./modules/admin')
const user = require('./modules/user')
const tweet = require('./modules/tweet')
const userController = require('../../controllers/apis/user-controller')
const { apiErrorHandler } = require('../../middleware/error-handler')
const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth')

router.use('/admin', authenticated, authenticatedAdmin, admin)
router.use('/users', user)
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.use('/tweets', tweet)
router.use('/', apiErrorHandler)

module.exports = router

const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const admin = require('./modules/admin')
const user = require('./modules/user')
const tweet = require('./modules/tweet')
const followship = require('./modules/followship')
const userController = require('../../controllers/apis/user-controller')
const { apiErrorHandler } = require('../../middleware/error-handler')

router.use('/admin', admin)
router.use('/users', user)
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.use('/tweets', tweet)
router.use('/followships', followship)
router.use('/', apiErrorHandler)

module.exports = router

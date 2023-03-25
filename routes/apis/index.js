const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const user = require('./modules/users')
const tweets = require('./modules/tweets')
const followships = require('./modules/followships')
const admin = require('./modules/admin')
const userController = require('../../controllers/apis/user-controller')
const { apiErrorHandler } = require('../../middleware/error-handler')
const { authenticated } = require('../../middleware/auth')

router.post('/users', userController.signUp)
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)

router.use('/followships', authenticated, followships)
router.use('/tweets', authenticated, tweets)
router.use('/users', authenticated, user)
router.use('/admin', admin)
router.use('/', apiErrorHandler)

module.exports = router

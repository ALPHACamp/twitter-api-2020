const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const users = require('./modules/users')
const tweets = require('./modules/tweets')
const followship = require('./modules/followship')
const passport = require('../config/passport')
const userController = require('../controllers/user-controller')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { apiErrorHandler } = require('../middleware/error-handler')

router.use('/admin', admin)
router.use('/user', users)
router.use('/tweets', tweets)
router.use('/followship', followship)

router.get('/currentuser', authenticated, userController.getCurrentUser)
router.post('/signup', userController.signUp)
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)

router.use('/', apiErrorHandler)

module.exports = router
const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const users = require('./modules/user')
const tweets = require('./modules/tweet')
const replies = require('./modules/reply')
const followships = require('./modules/followship')
const passport = require('../config/passport')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { errorHandler } = require('../middleware/error-handler')
const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')

router.post('/signin', passport.authenticate('local', { session: false, failWithError: true }), userController.signin)
router.post('/admin/signin', passport.authenticate('local', { session: false, failWithError: true }), adminController.signin)
router.post('/users', userController.signUp)

router.use('/admin', authenticated, authenticatedAdmin, admin)
router.use('/users', authenticated, users)
router.use('/tweets', authenticated, tweets)
router.use('/replies', authenticated, replies)
router.use('/followships', authenticated, followships)

router.use('/', errorHandler)

module.exports = router

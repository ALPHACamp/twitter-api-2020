const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')
const users = require('./modules/users')
const tweets = require('./modules/tweets')

const userController = require('../../controllers/user-controller')
const adminController = require('../../controllers/admin-controller')

// const { authenticate, authenticateAdmin } = require('../../middleware/api-auth')
const { apiErrorHandler } = require('../../middleware/error-handler')
const passport = require('passport')

router.post('/users/signIn', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/users', userController.signUp)

router.post('/admin/signIn', passport.authenticate('local', { session: false }), adminController.signIn)
router.use('/admin', admin)
router.use('/users', users)
router.use('/tweets', tweets)

router.use('/', apiErrorHandler)

module.exports = router

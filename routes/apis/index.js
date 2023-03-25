const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')
const users = require('./modules/users')
const tweets = require('./modules/tweets')

const userController = require('../../controllers/user-controller')

const { authenticate, authenticateAdmin } = require('../../middleware/api-auth')
const { apiErrorHandler } = require('../../middleware/error-handler')

router.post('/users/signIn', userController.signIn)
router.post('/users', userController.signUp)

router.use('/admin', authenticate, authenticateAdmin, admin)
router.use('/users', authenticate, users)
router.use('/tweets', authenticate, tweets)

router.use('/', apiErrorHandler)

module.exports = router

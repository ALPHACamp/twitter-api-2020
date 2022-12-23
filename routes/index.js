const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../middleware/api-auth')
const { apiErrorHandler } = require('../middleware/error-handler.js')

const user = require('./modules/user')
const followship = require('./modules/followship')
const tweet = require('./modules/tweet')
const admin = require('./modules/admin')
const auth = require('./modules/auth')

router.post('/users', userController.registerUser)
router.use('/auth', auth)
router.use('/admin', authenticated, authenticatedAdmin, admin)
router.use('/followships', authenticated, authenticatedUser, followship)
router.use('/tweets', authenticated, authenticatedUser, tweet)
// router.use('/users', authenticated, authenticatedUser, user)
router.use('/users', authenticated, user)// for development

router.use('/', apiErrorHandler)

module.exports = router

const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const users = require('./modules/users')
const tweets = require('./modules/tweets')
const userController = require('../controllers/apis/user-controller')
const { apiErrorHandler } = require('../middleware/error-handler')
const { authenticated } = require('../middleware/api-auth')

router.use('/api/admin', admin)
router.use('/api/users', users)
router.use('/api/tweets', tweets)

router.delete('/api/followships/:followingId', authenticated, userController.removeFollowing)
router.post('/api/followships', authenticated, userController.addFollowing)

router.use('/', apiErrorHandler)

module.exports = router

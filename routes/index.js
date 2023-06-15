const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const users = require('./modules/users')
const tweets = require('./modules/tweets')
const followships = require('./modules/followships')
const { apiErrorHandler } = require('../middleware/error-handler')
// import controllers
const userController = require('../controllers/user-controller')
// import auth
const { authenticated, authenticatedUser } = require('../middleware/api-auth')

// route branch
router.use('/api/admin', admin)
router.use('/api/users', users)
router.use('/api/tweets', tweets)
router.use('/api/followships', followships)
// current user
router.get('/api/user', authenticated, authenticatedUser, userController.getCurrentUser)

// error handler
router.use('/', apiErrorHandler)

module.exports = router

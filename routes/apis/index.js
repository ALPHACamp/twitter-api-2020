const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const dummyController = require('../../controllers/dummy-controller')

const { apiErrorHandler } = require('../../middleware/error-handler')
const passport = require('../../config/passport')
const { authenticated, authenticatedAdmin, isUser } = require('../../middleware/api-auth')

// // 以下是Dummy DATA
// router.get('/admin/users', dummyController.adminGetUsersDummy)
// router.get('/admin/tweets', dummyController.adminGetTweetsDummy)

// router.get('/users/top', dummyController.getTopUsersDummy) // for dummyData
// // router.get('/users/1/tweets', dummyController.getUserTweet)
// router.get('/users/1', dummyController.getUserDummy)
// // router.get('/users', dummyController.getUsersDummy)

// router.get('/tweets/1', dummyController.getTweetDummy)
// router.get('/tweets/', dummyController.getTweetsDummy)

// // 以上是Dummy DATA

// import modules
const admin = require('./modules/admin')
const followships = require('./modules/followships')
const likes = require('./modules/likes')
const tweets = require('./modules/tweets')
const users = require('./modules/users')

// sign signup單獨拉出來

router.post('/users', userController.signUp)
router.post('/signin', passport.authenticate('local', { session: false }), isUser, userController.signIn)

// use modules
router.use('/admin', authenticatedAdmin, admin)
router.use('/followships', followships)
router.use('/likes', likes)
router.use('/tweets', tweets)
router.use('/users', authenticated, isUser, users)

// Error Handler
router.use('/', apiErrorHandler)

module.exports = router

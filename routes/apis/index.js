const express = require('express')
const router = express.Router()

const passport = require('../../config/passport')
const userController = require('../../controllers/apis/user-controller')

const { authenticated } = require('../../middleware/api-auth')
const { apiErrorHandler } = require('../../middleware/error-handler')

router.get('/users/:id', authenticated, userController.getUser)
router.post('/users', userController.signUp)
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.get('/users/:id/tweets', authenticated, userController.getUserTweets)
router.get('/users/:id/replied_tweets', authenticated, userController.getUserReplies)
router.use('/', apiErrorHandler)

module.exports = router

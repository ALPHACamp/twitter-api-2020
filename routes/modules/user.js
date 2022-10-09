const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const { apiErrorHandler } = require('../../middleware/error-handler')
const { authenticated } = require('../../middleware/auth')

router.post('/signin', userController.signIn)
router.get('/:id/tweets', authenticated, userController.getUserTweets)
router.get('/:id/replied_tweets', authenticated, userController.getUserReply)
router.get('/:id', authenticated, userController.getUser)
router.post('/', userController.postUser)
router.use('/', apiErrorHandler)

module.exports = router

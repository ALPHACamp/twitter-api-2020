const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const { apiErrorHandler } = require('../../middleware/error-handler')
const { authenticated } = require('../../middleware/auth')

router.post('/signin', userController.signIn)
router.get('/:id/tweets', authenticated, userController.getUserTweets)
router.get('/popularUsers', authenticated, userController.getPopularUsers)
router.get('/:id/replied_tweets', authenticated, userController.getUserReplies)
router.get('/:id/followers', authenticated, userController.getUserFollowers)
router.get('/:id/followings', authenticated, userController.getUserFollowings)
router.get('/:id/likes', authenticated, userController.getUserLikes)

router.get('/:id', authenticated, userController.getUser)
router.post('/', userController.postUser)
router.use('/', apiErrorHandler)

module.exports = router

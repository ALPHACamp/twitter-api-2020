const express = require('express')
const router = express.Router()
const { authenticated } = require('../../middleware/auth')
const userController = require('../../controllers/user-controller')
const likeController = require('../../controllers/like-controller')
const replyController = require('../../controllers/reply-controller')

router.get('/:id/likes', authenticated, likeController.getUserLikes)
router.get('/:id/replies', authenticated, replyController.getUserReplies)
router.get('/:id/tweets', authenticated, userController.getUserTweets)
router.get('/:id/following', authenticated, userController.getFollowing)
router.get('/:id', authenticated, userController.getUser)
router.put('/:id', authenticated, userController.putUser)
router.get('/top', authenticated, userController.getTopFollwer)

module.exports = router
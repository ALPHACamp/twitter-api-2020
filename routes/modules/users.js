const express = require('express')
const router = express.Router()

const { authenticated, authUser } = require('../../middleware/auth')
const userController = require('../../controllers/user-controller')

router.post('/signin', userController.signin)
router.get('/currentUser', authenticated, userController.getCurrentUser)
router.get('/:id/tweets', authenticated, authUser, userController.getUserTweets)
router.get('/:id/likes', authenticated, userController.getUserLikes)
router.get('/:id/replied_tweets', authenticated, authUser, userController.getUserReplies)
router.get('/:id/followings', authenticated, userController.getUserFollowings)
router.get('/:id', authenticated, authUser, userController.getUser)
router.post('/', userController.signup)

module.exports = router

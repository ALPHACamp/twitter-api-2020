const express = require('express')
const router = express.Router()

const userController = require('../../controllers/user-controller')

router.get('/:id/replied_tweets', userController.getRepliedTweets)
router.get('/:id/followers', userController.getUserFollower)
router.get('/:id/followings', userController.getUserFollowing)
router.get('/:id/likes', userController.getUserLikes)
router.get('/:id/tweets', userController.getUserTweets)
router.get('/currentUser', userController.getCurrentUser)
router.get('/:id', userController.getUser)
router.put('/:id', userController.putUser)
router.get('/', userController.getUsers)

module.exports = router

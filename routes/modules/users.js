const express = require('express')
const router = express.Router()
const { authenticated } = require('../../middleware/auth')
const userController = require('../../controllers/user-controller')

router.get('/top', authenticated, userController.getTopUsers) 
router.get('/:id/tweets', authenticated, userController.getUserTweets)
router.get('/:id/likes', authenticated, userController.getUserLikes)
router.get('/:id/replies', authenticated, userController.getUserReplies)
router.get('/:id/followings', authenticated, userController.getUserFollowings)
router.get('/:id/followers', authenticated, userController.getUserFollowers)
router.get('/:id', authenticated, userController.getUser)
router.post('/:id', authenticated, userController.putUser)

module.exports = router
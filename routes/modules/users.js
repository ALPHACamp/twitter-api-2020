const express = require('express')
const router = express.Router()
const { authenticated } = require('../../middleware/auth')
const userController = require('../../controllers/user-controller')

router.use(authenticated)
router.get('/top', userController.getTopUsers) 
router.get('/:id/tweets', userController.getUserTweets)
router.get('/:id/likes', userController.getUserLikes)
router.get('/:id/replies', userController.getUserReplies)
router.get('/:id/followings', userController.getUserFollowings)
router.get('/:id/followers', userController.getUserFollowers)
router.get('/:id', userController.getUser)
router.put('/:id', userController.putUser)

module.exports = router
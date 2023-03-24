const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
// const upload = require('../../../middleware/multer')

router.post('/', userController.postSignUp)
router.get('/top', userController.getTopUsers)
router.get('/:id/followers', userController.getUserFollowers)
router.get('/:id/followings', userController.getUserFollowings)
router.get('/:id/likes', userController.getUserLikedTweets)
router.get('/:id/replied_tweets', userController.getUserRepliedTweets)
router.get('/:id/tweets', userController.getUserTweets)
router.put('/:id', userController.putUserProfile)
router.get('/:id', userController.getUser)

module.exports = router

const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const upload = require('../../middleware/multer')
const { authCurrentUser } = require('../../middleware/auth')

router.get('/top_followers', userController.getTopUsers)
router.get('/:id/tweets', userController.getUserTweets)
router.get('/:id/replied_tweets', userController.getUserReplies)
router.get('/:id/likes', userController.getUserLikedTweets)
router.get('/:id/followings', userController.getUserFollowings)
router.get('/:id/followers', userController.getUserFollowers)
router.put('/:id/setting', authCurrentUser, userController.putUserSetting)
router.get('/:id', userController.getUserProfile)
router.put('/:id', authCurrentUser, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), userController.putUserProfile)

module.exports = router

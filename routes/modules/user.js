const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const { authenticatedCurrentUser } = require('../../middleware/authentication')
const upload = require('../../middleware/multer')

router.get('/:id/followers', userController.getUserFollowers)
router.get('/:id/followings', userController.getUserFollowings)
router.get('/:id/likes', userController.getUserLikedTeets)
router.get('/:id/replied_tweets', userController.getUserReplies)
router.get('/:id/tweets', userController.getUserTweets)
router.put('/:id', authenticatedCurrentUser, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'avatar', maxCount: 1 }]), userController.putUserProfile)
router.get('/:id', userController.getUserProfile)

module.exports = router

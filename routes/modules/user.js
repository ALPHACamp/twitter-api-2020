const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const { authenticatedCurrentUser } = require('../../middleware/auth')
const upload = require('../../middleware/multer')

router.get('/top', userController.getTopUsers)
router.get('/:id/followers', userController.getUserFollowers)
router.get('/:id/followings', userController.getUserFollowings)
router.get('/:id/likes', userController.getUserLikedTweets)
router.get('/:id/replied_tweets', userController.getUserRepliedTweets)
router.get('/:id/tweets', userController.getUserTweets)
router.put('/:id', authenticatedCurrentUser, userController.putUserSetting)
router.put('/:id/profile', authenticatedCurrentUser, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), userController.putUserProfile)

router.get('/:id', userController.getUser)

module.exports = router

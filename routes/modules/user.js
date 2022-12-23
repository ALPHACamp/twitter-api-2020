const express = require('express')
const router = express.Router()

const userController = require('../../controllers/user-controller')
const upload = require('../../middleware/multer')
const { userProfileValidation, userSettingValidation } = require('../../middleware/server-side-validation')

router.get('/top', userController.getUsersTop)
router.put('/:id/setting', userSettingValidation, userController.putUserSetting)
router.get('/:id/replied_tweets', userController.getUserReplies)
router.get('/:id/tweets', userController.getUserTweets)
router.get('/:id/likes', userController.getUserLikes)
router.get('/:id/followers', userController.getUserFollowers)
router.get('/:id/followings', userController.getUserFollowings)
router.get('/:id', userController.getUserProfile)
router.put('/:id', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), userProfileValidation, userController.putUserProfile)

module.exports = router

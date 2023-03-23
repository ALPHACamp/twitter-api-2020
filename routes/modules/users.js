const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const { authenticatedOwner } = require('../../middleware/auth')
const upload = require('../../middleware/multer')

// 粉絲清單
router.get('/:id/followers', userController.getUserFollower)

// 追蹤清單
router.get('/:id/followings', userController.getUserFollowing)

// 點讚清單
router.get('/:id/likes', userController.getUserLikes)

// 留言清單
router.get('/:id/replied_tweets', userController.getUserReplies)

// 推文清單
router.get('/:id/tweets', userController.getUserTweets)

// 個人設定
router.get('/:id/setting', authenticatedOwner, userController.getUserSetting)

// 編輯個人設定
router.put('/:id/setting', authenticatedOwner, userController.putUserSetting)

// 個人資料
router.get('/:id', userController.getUser)

// 編輯個人資料
router.put('/:id', authenticatedOwner, upload, userController.putUser)

module.exports = router

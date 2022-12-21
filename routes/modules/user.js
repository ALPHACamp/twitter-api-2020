const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const upload = require('../../middleware/multer')
const { authCurrentUser } = require('../../middleware/auth')

// 取得使用者的所有推文留言
router.get('/:id/replied_tweets', userController.getUserReplies)
// 取得使用者的所有推文
router.get('/:id/tweets', userController.getUserTweets)
// 取得使用者喜歡的推文
router.get('/:id/likes', userController.getUserLikedTweets)
// 取得使用者正在關注的名單
router.get('/:id/followings', userController.getUserFollowings)
// 取得使用者正在跟隨的名單
router.get('/:id/followers', userController.getUserFollowers)
// 修改個人帳號設定
router.put('/:id/setting', authCurrentUser, userController.putUserSetting)
// 修改個人資料中的背景圖
router.patch('/:id/cover', authCurrentUser, upload.fields({ name: 'cover', maxCount: 1 }), userController.patchUserCover)
// 修改個人資料
router.put('/:id', authCurrentUser, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), userController.putUserProfile)
// 取得使用者
router.get('/:id', userController.getUser)

module.exports = router

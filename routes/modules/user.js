const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const upload = require('../../middleware/multer')

// 取得使用者的所有推文留言
router.get('/:id/replied_tweets', userController.getUserReplies)
// 取得使用者的所有推文
router.get('/:id/tweets', userController.getUserTweets)
// 取得使用者喜歡的內容
router.get('/:id/likes', userController.getUserLikes)
// 取得使用者正在關注的名單
router.get('/:id/followings', userController.getUserFollowings)
// 取得使用者正在跟隨的名單
router.get('/:id/followers', userController.getUserFollowers)
// 修改個人帳號設定
router.put('/:id/setting', userController.putUserSetting)
// 修改個人資料
router.put('/:id', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), userController.putUserProfile)
// 取得特定使用者
router.get('/:id', userController.getUser)

module.exports = router

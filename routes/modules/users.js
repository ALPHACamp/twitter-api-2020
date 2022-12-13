const express = require('express')
const router = express.Router()
const { registerValidator, editSettingValidator } = require('../../middleware/validator')
const userController = require('../../controllers/user-controller')
const { authenticated, authenticatedUser, authenticatedSelf } = require('../../middleware/auth')
const upload = require('../../middleware/multer')

// 登入
router.post('/login', userController.login)
// 取得追隨者前10的使用者
router.get('/topUsers', authenticated, authenticatedUser, userController.getTopUsers)
// 取得使用者全部推文
router.get('/:id/tweets', authenticated, authenticatedUser, userController.getUserTweets)
// 取得使用者全部回覆
router.get('/:id/replied_tweets', authenticated, authenticatedUser, userController.getUserReplies)
// 取得使用者全部喜歡內容
router.get('/:id/likes', authenticated, authenticatedUser, userController.getUserLikes)
// 取得使用者追隨中的人
router.get('/:id/followings', authenticated, authenticatedUser, userController.getUserFollowings)
// 取得追隨使用者的人
router.get('/:id/followers', authenticated, authenticatedUser, userController.getUserFollowers)
// 取得使用者資料
router.get('/:id', authenticated, authenticatedUser, userController.getUserProfile)
// 編輯使用者帳號設定
router.put('/:id/setting', authenticated, authenticatedUser, authenticatedSelf, editSettingValidator, userController.editUserSetting)
// 編輯使用者profile設定
router.put('/:id', authenticated, authenticatedUser, authenticatedSelf, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), userController.editUserProfile)
// 註冊
router.post('/', registerValidator, userController.register)

module.exports = router

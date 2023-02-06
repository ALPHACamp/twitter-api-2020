const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const upload = require('../../middleware/multer')
const cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }])

// 取得使用者回覆過的留言
router.get('/:id/replied_tweets', userController.getUserReplies)
// 取得使用者推文
router.get('/:id/tweets', userController.getUserTweets)
// 取得使用者追隨的人
router.get('/:id/followings', userController.getUserFollowings)
// 取得追隨使用者的人
router.get('/:id/followers', userController.getUserFollowers)
// 取得 user likes
router.get('/:id/likes', userController.getLikes)
// 更新使用者帳號資料
router.put('/:id/setting', userController.putUserSetting)
// 取得使用者資料
router.get('/:id', userController.getUser)
// 更新使用者個人資料
router.put('/:id', cpUpload, userController.putUserProfile)

module.exports = router

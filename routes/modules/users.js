
const express = require('express')
const router = express.Router()

const upload = require('../../middleware/multer')

const userController = require('../../controllers/user-controller')

// users相關路由
router.get('/:id', userController.getUser) // No.3 - 查看某使用者的資料
router.get('/:id/tweets', userController.getUserTweets) // No.4 - 查看某使用者發過的推文
router.get('/:id/replied_tweets', userController.getUserReplies) // No.5 - 查看某使用者發過的回覆
router.get('/:id/likes', userController.getUserLikes) // No.6 - 查看某使用者點過like的推文
router.get('/:id/followings', userController.getUserFollowings) // No.7 - 查看某使用者追蹤中的人
router.get('/:id/followers', userController.getUserFollowers) // No.8 - 查看某使用者的追隨者
router.get('/', userController.getUsers) // No.9 - 查看跟隨者數量排名(前10)的使用者資料
router.put('/:id', upload.fields([{ name: 'avatar' }, { name: 'banner' }]), userController.putUser) // No.10 - 編輯使用者資料

module.exports = router

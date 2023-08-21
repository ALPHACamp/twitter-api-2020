const router = require('express').Router()
const userController = require('../../controllers/user-controller')
const { multiUpload } = require('../../middleware/multer')

router.get('/topFollowers', userController.getTopFollower) // 取得follower 前10多的user資料
router.get('/:id/tweets', userController.getUserTweets) // 取得user發過的tweets
router.get('/:id/replied_tweets', userController.getUserReplies)// 取得user回覆的tweets
router.get('/:id/likes', userController.getUserLikes) // 取得user Like過的tweets
router.get('/:id/followings', userController.getFollowings)// 取得user正在追蹤的使用者
router.get('/:id/followers', userController.getFollowers)// 取得正在追蹤user的使用者
router.put('/:id/profile', multiUpload, userController.putUserProfile) // 編輯user profile
router.put('/:id', userController.putUserSetting) // 編輯user Setting資料
router.get('/:id', userController.getUserData) // 取得user資料

module.exports = router

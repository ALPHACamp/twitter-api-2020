const router = require('express').Router()
const userController = require('../../controllers/user-controller')

// test route (delete later)
router.get('/', (req, res, next) => {
  res.json('/api/users/  (Test API Delete Later)')
})

router.get('/:id/tweets', userController.getUserTweets) // 取得user發過的tweets
router.get('/:id/replied_tweets', userController.getUserReplies)// 取得user回覆的tweets
router.get('/:id/likes', userController.getUserLikes) // 取得user Like過的tweets
router.get('/:id/followings', userController.getFollowings)// 取得user正在追蹤的使用者
router.get('/:id/followers', userController.getFollowers)// 取得正在追蹤user的使用者
router.get('/:id', userController.getUserData) // 取得user資料
router.put('/:id', userController.putUserData) // 編輯user資料


module.exports = router

const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const user2Controller = require('../../controllers/user2-controller') // ********Evelyn 先註記一下 避免搞混
const {
  authenticatedUser,
  authenticated
} = require('../../middleware/api-auth')
const upload = require('../../middleware/multer')

// 登入不需要驗證登入狀態
router.post('/signin', userController.signIn)

// 查看特定使用者發過的所有回覆 ********Evelyn 先註記一下 避免搞混
router.get('/:id/replied_tweets', authenticated, authenticatedUser, user2Controller.getUserReplies)
// 查看特定使用者發過的所有推文 ********Evelyn 先註記一下 避免搞混
router.get('/:id/tweets', authenticated, authenticatedUser, user2Controller.getUserTweets)

// 測試檔規定 name 為 root 的使用者要能進入，所以不限定 role
router.get('/:id', authenticated, authenticatedUser, userController.getUser)

// 編輯個人頁面
router.put(
  '/:id',
  authenticated,
  authenticatedUser,
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
  ]),
  userController.putUser
)

// 註冊不需要驗證登入狀態
router.post('/', userController.signUp)

module.exports = router

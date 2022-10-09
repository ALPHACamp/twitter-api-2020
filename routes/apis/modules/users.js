const express = require('express')
const router = express.Router()

const passport = require('../../../config/passport')
const { authenticated, authenticatedUser } = require('../../../middleware/api-auth')
const userController = require('../../../controllers/user-controller')

// 使用者頁面ＡＰＩ
router.get('/:id/tweets', authenticated, authenticatedUser, userController.getUserTweets) // 取得使用者發過的推文
router.get('/:id/replied_tweets', authenticated, authenticatedUser, userController.getUserReplies) // 取得使用者回覆過的留言
router.get('/:id/likes', authenticated, authenticatedUser, userController.getUserLikes)
router.get('/:id/followings', authenticated, authenticatedUser, userController.getUserFollowings)
router.get('/:id/followers', authenticated, authenticatedUser, userController.getUserFollowers)
router.put('/:id/setting', authenticated, authenticatedUser, userController.putUserSetting) // 使用者帳號更新
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn) // 使用者登入
router.get('/:id', authenticated, authenticatedUser, userController.getUserProfile) // 取得使用者資料
router.put('/:id', authenticated, authenticatedUser, userController.putUserProfile) // 更新使用者資料
router.post('/', userController.signUp) // 使用者註冊

module.exports = router

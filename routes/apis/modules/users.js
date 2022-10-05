const express = require('express')
const router = express.Router()

const passport = require('../../../config/passport')
const { authenticated } = require('../../../middleware/api-auth')
const userController = require('../../../controllers/user-controller')

// 使用者頁面ＡＰＩ
router.get('/:id/tweets', authenticated, userController.getUserTweets) // 取得使用者發過的推文

router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn) // 使用者登入
router.get('/:id', authenticated, userController.getUserProfile) // 取得使用者資料
router.put('/:id', authenticated, userController.putUserProfile) // 更新使用者資料
router.post('/', userController.signUp) // 使用者註冊

module.exports = router

const express = require('express')
const router = express.Router()

const passport = require('../../../config/passport')
const { authenticatedAdmin, authenticated } = require('../../../middleware/api-auth')
const adminController = require('../../../controllers/admin-controller')

router.delete('/tweets/:id', authenticated, authenticatedAdmin, adminController.deleteTweet) // 刪除推文
router.get('/tweets', authenticated, authenticatedAdmin, adminController.getTweets) // 取得所有推文
router.get('/users', authenticated, authenticatedAdmin, adminController.getUsers) // 取得所有使用者資料
router.post('/signin', passport.authenticate('local', { session: false }), adminController.signIn) // 後台登入

module.exports = router

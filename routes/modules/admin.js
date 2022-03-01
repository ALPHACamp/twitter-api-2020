const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const { authenticated, authenticatedAdmin } = require('../../middleware/auth')
const adminController = require('../../controllers/admin-controller')

router.post('/signin', passport.authenticate('local', { session: false }), adminController.signIn)
router.get('/users', authenticated, authenticatedAdmin, adminController.getUsers)
router.get('/tweets', authenticated, authenticatedAdmin, adminController.getTweets)
router.delete('/tweets/:id', authenticated, authenticatedAdmin, adminController.deleteTweet)

module.exports = router

// POST /api/admin/signin 管理員登入 (測試未出現)
// GET /api/admin/users 管理員可以取得所有使用者資訊
// GET /api/admin/tweets 管理員可以取得所有 Tweet (測試未出現)
// DELETE /api/admin/tweets/:id 管理員可以刪除特定 Tweet

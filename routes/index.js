const express = require('express')
const router = express.Router()

const userController = require('../controllers/user-controller')
const passport = require('../config/passport')
const admin = require('./modules/admin')
const upload = require('../middleware/multer')
// const { auth, isAdmin, isUser } = require('../middleware/api-auth')
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../middleware/api-auth')
const { apiErrorHandler } = require('../middleware/error-handler')

router.use('/api/admin', authenticated, authenticatedAdmin, admin)
// router.get('/api/admin/restaurants', authenticated, apiErrorHandler)

// (下1) 單一 user 的所有推文
router.get('/api/users/:id/tweets', authenticated, authenticatedUser, userController.getTweets)
// (下1) 單一 user 的所有回覆
router.get('/api/users/:id/replied_tweets', authenticated, authenticatedUser, userController.getReplies)
router.get('/api/users/:id', authenticated, authenticatedUser, userController.getUserInfo)

router.post('/api/users', userController.signUp) // 註冊帳號路由
router.put('/api/users/:id', authenticated, authenticatedUser, upload.single('image'), userController.putUser)
// (下1) session: false 的功能，把 cookie/session 功能關掉，不管理它
router.post('/api/signin', passport.authenticate('local', { session: false }), userController.signIn) // 注意是 post

router.use('/', apiErrorHandler)

module.exports = router

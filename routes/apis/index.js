const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')
const users = require('./modules/users')

const {
  authenticated,
  authenticatedAdmin
} = require('../../middleware/api-auth')
const followshipRouter = require('./modules/followship')
const tweetRouter = require('./modules/tweet')
const { apiErrorHandler } = require('../../middleware/api-error-handler')
const adminController = require('../../controllers/admin-controller')
const userController = require('../../controllers/user-controller')

// 前台登入
router.post('/login', userController.login)

// 前台註冊
router.post('/users', userController.postUsers)

// 後台登入
router.post('/admin/login', adminController.login)

// 獲取目前使用者是誰
router.get('/current_user', authenticated, userController.getCurrentUser)

// 後台管理員路由
router.use('/admin', authenticated, authenticatedAdmin, admin)

// 前台使用者相關路由
router.use('/followships', authenticated, followshipRouter)
router.use('/tweets', authenticated, tweetRouter)
router.use('/users', authenticated, users)



router.use(apiErrorHandler)
module.exports = router
const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')
const users = require('./modules/users')

const { authenticated } = require('../../middleware/api-auth')
const followshipRouter = require('./modules/followship')
const tweetRouter = require('./modules/tweet')
const { apiErrorHandler } = require('../../middleware/api-error-handler')

const userController = require('../../controllers/user-controller')
router.get('/current_user', authenticated, userController.getCurrentUser)

// 登入
router.post('/login', userController.login)
// 註冊
router.post('/users', userController.postUsers)
router.use('/followships', authenticated, followshipRouter)
router.use('/tweets', authenticated, tweetRouter)
router.use('/admin', admin)
router.use('/users', authenticated, users)

router.use(apiErrorHandler)
module.exports = router
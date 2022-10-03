const express = require('express')
const admin = require('./modules/admin')
const followship = require('./modules/followship')
const tweet = require('./modules/tweet')
const user = require('./modules/user')

const router = express.Router()

const passport = require('../config/passport')
const userController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')

// admin 登入路由
router.post('/api/admin/signin', passport.authenticate('local', { session: false }), userController.signIn)

// 一般使用者登入路由
router.post('/api/users/signin', passport.authenticate('local', { session: false }), userController.signIn)
// modules
router.use('/api/followship', authenticated, followship)
router.use('/api/tweets', authenticated, tweet)
router.use('/api/admin', authenticated, authenticatedAdmin, admin)
router.use('/api/users', authenticated, user)
router.get('/', (req, res) => res.send('Hello World!'))

// 錯誤處理
router.use(generalErrorHandler)
module.exports = router

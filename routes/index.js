const express = require('express')
const admin = require('./modules/admin')
const followship = require('./modules/followship')
const tweet = require('./modules/tweet')
const user = require('./modules/user')

const router = express.Router()

const passport = require('../config/passport')
const userController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middleware/error-handler')

// modules
router.use('/api/followship', followship)
router.use('/api/tweets', tweet)
router.use('/api/admin', admin)
router.use('/api/users', user)
router.get('/', (req, res) => res.send('Hello World!'))

// 登入路由

// admin 登入路由
router.post('/api/admin/signin', passport.authenticate('local', { session: false }), userController.signIn)

// 一般使用者登入路由
router.post('/api/signin', passport.authenticate('local', { session: false }), userController.signIn)

// 錯誤處理
router.use(generalErrorHandler)
module.exports = router

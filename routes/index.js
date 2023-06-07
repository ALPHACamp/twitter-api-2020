const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const adminController = require('../controllers/admin-controller')
const userController = require('../controllers/user-controller')
const { apiErrorHandler } = require('../middleware/error-handler')
const admin = require('./modules/admin')
const tweets = require('./modules/tweet')
const users = require('./modules/user')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')

// 註冊
router.post('/users', userController.signup)
// 後台登入
router.post('/adminSignin', passport.authenticate('local', { session: false }), adminController.signIn)
// 前台登入
router.post('/users/signin', passport.authenticate('local', { session: false }), userController.signIn)

router.use('/admin', authenticated, authenticatedAdmin, admin)
router.use('/users', authenticated, users)
router.use('/tweets', authenticated, tweets)
router.use('/', apiErrorHandler)
module.exports = router

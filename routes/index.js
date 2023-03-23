const router = require('express').Router()
const passport = require('../config/passport')
const errorHandler = require('../middleware/error-handler')
const userController = require('../controllers/user-controller')
const { authenticated, authenticatedAdmin, authenticatedUser, checkFieldNotEmpty } = require('../middleware/auth')
const users = require('./modules/users')
const tweets = require('./modules/tweets')
const admin = require('./modules/admin')

// 使用者登入
router.post('/users/login', checkFieldNotEmpty, passport.authenticate('local', { session: false }), userController.login)

// 管理者登入
router.post('/admin/login', checkFieldNotEmpty, passport.authenticate('local', { session: false }), userController.login)

// 使用者註冊
router.post('/users', userController.register)

router.use('/users', authenticated, authenticatedUser, users)
router.use('/tweets', authenticated, authenticatedUser, tweets)
router.use('/admin', authenticated, authenticatedAdmin, admin)

router.use('/', errorHandler)

module.exports = router

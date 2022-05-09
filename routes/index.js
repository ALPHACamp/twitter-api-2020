const express = require('express')
const router = express.Router()
const passport = require('passport')
const userController = require('../controllers/user-controller')

const admin = require('./modules/admin')
const user = require('./modules/user')
const { authenticated, authenticatedUser, authenticatedAdmin } = require('../middleware/auth')

const passportAuth = passport.authenticate('local', { session: false })
// 註冊以及登入不用驗證身份
router.post('/users', userController.register)
router.post('/login', passportAuth, authenticatedUser, userController.login)
router.post('/admin/login', passportAuth, authenticatedAdmin, userController.login)

router.use('/admin', authenticated, authenticatedAdmin, admin)
router.use('/users', authenticated, authenticatedUser, user)

module.exports = router

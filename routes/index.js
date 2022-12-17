const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const user = require('./modules/user')
const admin = require('./modules/admin')
const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')
const { authenticated, authenticatedUser, authenticatedAdmin } = require('../middleware/auth')
const { apiErrorHandler } = require('../middleware/error-handler')
// 使用者登入
router.post('/users/signin', passport.authenticate('local', { session: false }), userController.signIn)
// 管理者登入
router.post('/admin/signin', passport.authenticate('local', { session: false }), adminController.signIn)
router.use('/users', authenticated, authenticatedUser, user)
router.use('/admin', authenticated, authenticatedAdmin, admin)
router.post('/users', userController.signUp)
router.use('/', apiErrorHandler)

module.exports = router

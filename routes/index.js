const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
// const admin = require('./modules/admin')
// const { authenticated, authenticatedAdmin } = require('../middleware/api-auth')
const userController = require('../controllers/user-controller')
const { apiErrorHandler } = require('../middleware/error-handler')

// router.use('/admin', authenticated, authenticatedAdmin, admin)

// users
router.post('/users/signin', passport.authenticate('local', { session: false }), userController.signIn) // 登入
router.post('/users/', userController.signUp) // 註冊

router.use('/', apiErrorHandler)
module.exports = router

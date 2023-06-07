const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const admin = require('./modules/admin')
const { apiErrorHandler } = require('../middleware/error-handler')
// const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth')
const userController = require('../controllers/userController')

// router.use('/admin', authenticated, authenticatedAdmin, admin)
router.post('/signup', userController.signUp)
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn) // 告訴passport不用session了 改用token驗證
router.use('/', apiErrorHandler)
module.exports = router
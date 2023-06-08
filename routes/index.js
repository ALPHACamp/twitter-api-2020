const express = require('express')
const passport = require('../config/passport')
const router = express.Router()
const admin = require('./modules/admin')
const userController = require('../controllers/apis/user-controller')
const adminController = require('../controllers/apis/admin-controller')
const { apiErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedAdmin } = require('../middleware/api-auth')

// router.use('/admin', authenticated, authenticatedAdmin, admin)

// if  req.user.role = admin 不能登入
router.post('/api/signin', passport.authenticate('local', { session: false, failWithError: true }), userController.signIn)
router.post('/api/signup', userController.signUp)
// if  req.user.role = admin 才能登入
router.post('/api/admin/signin', passport.authenticate('local', { session: false, failWithError: true }), adminController.signIn)

router.use('/', apiErrorHandler)

module.exports = router

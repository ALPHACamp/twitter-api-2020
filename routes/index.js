const express = require('express')
const router = express.Router()
const { errorHandler } = require('../middleware/error-handler')
const user = require('./modules/user')
const admin = require('./modules/admin')
const tweet = require('./modules/tweet')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')
const followship = require('./modules/followship')

//登入註冊功能路由
router.post('/users/signin', userController.signIn)
router.post('/users', userController.signUp)
router.post('/admin/signin', adminController.signIn)

// 功能路由
router.use('/followships', authenticated, followship)
router.use('/tweets', authenticated, tweet)
router.use('/users', authenticated, user)
router.use('/admin', authenticated, authenticatedAdmin, admin)
router.use('/', errorHandler)

module.exports = router
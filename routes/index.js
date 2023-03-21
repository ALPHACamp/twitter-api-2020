const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')
const users = require('./modules/users')
const tweets = require('./modules/tweets')
const followships = require('./modules/followships')

const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')

const { authenticated, authenticatedAdmin, authenticatedUser } = require('../middleware/auth')
const { errorHandler } = require('../middleware/error-handler')

// 註冊
router.post('/users', userController.signUp)

// 登入
router.post('/users/signin', userController.signIn)

router.use('/users', authenticated, authenticatedUser, users)

router.use('/tweets', authenticated, authenticatedUser, tweets)

router.use('/followships', authenticated, authenticatedUser, followships)

router.post('/admin/signin', adminController.signIn)

router.use('/admin', authenticated, authenticatedAdmin, admin)

router.use('/', errorHandler)

module.exports = router

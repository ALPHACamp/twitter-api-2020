const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const admin = require('./modules/admin')
const tweets = require('./modules/tweets')
const users = require('./modules/users')
const followships = require('./modules/followships')
const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')

// 後台登入
router.post('/api/admin/signin', adminController.signIn)
// 前台登入
router.post('/api/signin', passport.authenticate('local', { session: false }), userController.signIn)

router.use('/api/users', users)
router.use('/api/admin', authenticated, authenticatedAdmin, admin)
router.use('/api/tweets', authenticated, tweets)
// router.use('/api/followships', authenticated, followships)

router.use('/', generalErrorHandler)

module.exports = router

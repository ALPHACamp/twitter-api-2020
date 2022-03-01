const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const tweets = require('./modules/tweets')
const users = require('./modules/users')
const followships = require('./modules/followships')
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')

router.use('/api/admin', authenticated, authenticatedAdmin, admin)
router.use('/api/tweets', authenticated, tweets)
router.use('/api/followships', authenticated, followships)

// TODO user router
router.use('/api/users', users)

// TODO 登入 用這裡
// router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn) // 注意是 Post

router.use('/', generalErrorHandler)

module.exports = router

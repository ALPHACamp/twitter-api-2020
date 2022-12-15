const express = require('express')
const router = express.Router()
const { authenticated, authenticatedUser } = require('../middleware/api-auth')
const { apiErrorHandler } = require('../middleware/error-handler')
const users = require('./modules/users')
const admin = require('./modules/admin')
const tweets = require('./modules/tweets')
const followships = require('./modules/followships')

router.use('/users', users)
router.use('/admin', admin)
// tweet admin跟user有共用到1條，所以這裡只需要判斷使用者是否有登入
router.use('/tweets', authenticated, tweets)
// followships路由只有 user才能進入
router.use('/followships', authenticated, authenticatedUser, followships)

router.use('/', apiErrorHandler)
module.exports = router

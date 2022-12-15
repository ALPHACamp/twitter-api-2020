const express = require('express')
const router = express.Router()
const { authenticatedAdmin, adminPassValid } = require('../middleware/api-auth')
const tweets = require('./modules/tweets')
const { apiErrorHandler } = require('../middleware/error-handler')
const users = require('./modules/users')
const tweets = require('./modules/tweets')
const admin = require('./modules/admin')
const followships = require('./modules/followships')

router.use('/users', users)

router.use('/admin', authenticated, authenticatedAdmin, admin)
router.use('/tweets', authenticated, tweets)
router.use('/followships', authenticated, followships)


// admin相關路由只有admin才能進去
router.get('/admin', authenticatedAdmin, adminPassValid, (req, res) => {
  res.send('123')
})

router.use('/', apiErrorHandler)
module.exports = router

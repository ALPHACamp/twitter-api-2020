const express = require('express')
const router = express.Router()
const { authenticatedAdmin, adminPassValid } = require('../middleware/api-auth')
const tweets = require('./modules/tweets')
const { apiErrorHandler } = require('../middleware/error-handler')
const users = require('./modules/users')

router.use('/users', users)

// admin相關路由只有admin才能進去
router.get('/admin', authenticatedAdmin, adminPassValid, (req, res) => {
  res.send('123')
})

router.use('/tweets', tweets)

router.use('/', apiErrorHandler)
module.exports = router

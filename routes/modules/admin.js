const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/apis/admin-controller')
const { authenticated } = require('../../middleware/api-auth')


router.get('/api/tweets', authenticated, adminController.getTweets)

module.exports = router
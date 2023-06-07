const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')
// upload 記得做

router.get('/tweets', adminController.getTweets)

module.exports = router
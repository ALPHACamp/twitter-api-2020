const express = require('express')
const router = express.Router()
const adminController = require('../../../controllers/apis/admin-controller')
router.get('/tweets', adminController.getTweets)
module.exports = router
const express = require('express')
const adminController = require('../../controllers/admin-controller')
const router = express.Router()

router.get('/tweets', adminController.tweets)

module.exports = router

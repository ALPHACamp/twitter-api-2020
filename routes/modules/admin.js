const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

router.get('/users', adminController.getUsers)
router.get('/tweets', adminController.getAdminTweets)

module.exports = router
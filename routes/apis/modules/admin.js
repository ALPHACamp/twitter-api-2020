const express = require('express')
const router = express.Router()

const adminController = require('../../../controllers/apis/admin-controller')

router.get('/users', adminController.getUsers)
router.delete('/tweets/:tweetId', adminController.deleteTweet)

module.exports = router

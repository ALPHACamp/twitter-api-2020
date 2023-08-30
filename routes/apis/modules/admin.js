const express = require('express')
const router = express.Router()
const adminController = require('../../../controllers/admin-controller')
const tweetController = require('../../../controllers/tweet-controller')

router.get('/users', adminController.getUsers)
// router.delete('/tweets/:id', adminController)
router.get('/tweets', adminController.getTweets)

module.exports = router

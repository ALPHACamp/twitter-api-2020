const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')

router.get('/tweets', adminController.getTweets)
router.get('/users', adminController.getUsers)
router.delete('/tweets/:id', adminController.removeTweet)

module.exports = router
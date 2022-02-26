const express = require('express')
const adminController = require('../../controllers/adminController')
const router = express.Router()

// admin 
router.get('/users', adminController.getUsers)
router.get('/tweets', adminController.getTweets)
router.delete('/tweets/:id', adminController.deleteTweet)


module.exports = router
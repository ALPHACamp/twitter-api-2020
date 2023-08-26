const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')

// users相關
router.get('/users', adminController.getUsers)

// tweets相關
router.delete('/tweets/:id', adminController.deleteTweet)
router.get('/tweets', adminController.getTweets)

module.exports = router

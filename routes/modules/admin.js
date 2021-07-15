const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/adminController')

router.get('/users', adminController.getUsers)
router.delete('/tweets/:id', adminController.deleteTweet)
router.get('/tweets', adminController.getTweets)

router.get('/users/:id', adminController.getUser)

module.exports = router

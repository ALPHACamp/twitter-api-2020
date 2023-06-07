const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/adminController')

router.get('/users', adminController.getUsers)
router.delete('/users/:id', adminController.deleteUser)
router.get('/tweets', adminController.getTweets)
router.delete('/tweets/:id', adminController.deleteTweet)
router.get('/replies', adminController.getReplies)
router.delete('/replies/:id', adminController.deleteReply)

module.exports = router
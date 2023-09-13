const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/adminController')
const { authenticatedAdmin } = require('../../middleware/api-auth')

router.get('/users', authenticatedAdmin, adminController.getUsers)
router.delete('/users/:id', authenticatedAdmin, adminController.deleteUser)
router.get('/tweets', authenticatedAdmin, adminController.getTweets)
router.delete('/tweets/:id', authenticatedAdmin, adminController.deleteTweet)
router.get('/replies', authenticatedAdmin, adminController.getReplies)
router.delete('/replies/:id', authenticatedAdmin, adminController.deleteReply)

module.exports = router

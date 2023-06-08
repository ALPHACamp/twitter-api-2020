const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/adminController')
const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth')

router.get('/users',authenticated, authenticatedAdmin, adminController.getUsers)
router.delete('/users/:id', authenticated, authenticatedAdmin, adminController.deleteUser)
router.get('/tweets', authenticated, authenticatedAdmin, adminController.getTweets)
router.delete('/tweets/:id', authenticated, authenticatedAdmin, adminController.deleteTweet)
router.get('/replies', authenticated, authenticatedAdmin, adminController.getReplies)
router.delete('/replies/:id', authenticated, authenticatedAdmin, adminController.deleteReply)

module.exports = router
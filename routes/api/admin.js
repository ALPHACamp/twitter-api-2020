const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/api/adminController')
const { authenticated, authenticatedAdmin } = require('../../middleware/auth')

router.post('/login', adminController.login)

router.use(authenticated, authenticatedAdmin)
router.delete('/tweets/:tweetId', adminController.deleteTweet)
router.get('/users', adminController.getUsers)
router.get('/tweets', adminController.getTweets)

module.exports = router

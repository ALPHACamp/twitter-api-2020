const express = require('express')
const router = express.Router()
const passport = require('../../../config/passport')
const adminController = require('../../../controllers/apis/admin-controller')
const { authenticatedAdmin } = require('../../../middleware/auth')

router.post('/signin', passport.authenticate('local', { session: false }), adminController.signIn)
router.get('/users', authenticatedAdmin, adminController.getUsers)
router.get('/tweets', authenticatedAdmin, adminController.getTweets)
router.delete('/tweets/:tweetId', authenticatedAdmin, adminController.deleteTweet)

module.exports = router

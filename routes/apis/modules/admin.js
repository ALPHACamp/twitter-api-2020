const express = require('express')
const router = express.Router()
const passport = require('../../../config/passport')
const adminController = require('../../../controllers/apis/admin-controller')
const { authenticated, authenticatedAdmin } = require('../../../middleware/auth')

router.post('/signin', passport.authenticate('local', { session: false }), adminController.signIn)
router.get('/users', authenticated, authenticatedAdmin, adminController.getUsers)
router.get('/tweets', authenticated, authenticatedAdmin, adminController.getTweets)
router.delete('/tweets/:tweetId', authenticated, authenticatedAdmin, adminController.deleteTweet)

module.exports = router

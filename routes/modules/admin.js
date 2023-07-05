const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/apis/admin-controller')
const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth')
const passport = require('../../config/passport')


router.post('/signin', passport.authenticate('local', { session: false, failWithError: true }), adminController.signIn)
router.delete('/tweets/:tweetId', authenticated, authenticatedAdmin, adminController.deleteTweet)
router.get('/users', authenticated, authenticatedAdmin, adminController.getUsers)
router.get('/tweets', authenticated, authenticatedAdmin, adminController.getTweets)

module.exports = router
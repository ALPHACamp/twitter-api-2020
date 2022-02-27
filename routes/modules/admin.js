const express = require('express')
const passport = require('../../config/passport')
const adminController = require('../../controllers/admin-controller')
const { authenticated, authenticatedAdmin } = require('../../middleware/auth')

const router = express.Router()

router.post('/users/login', passport.authenticate('local', { session: false }), adminController.signIn)
router.get('/users', authenticated, authenticatedAdmin, adminController.getUsers)
router.get('/tweets', authenticated, authenticatedAdmin, adminController.getTweets)
router.delete('/tweets/:tweetId', authenticated, authenticatedAdmin, adminController.deleteTweet)

module.exports = router

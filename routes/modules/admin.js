const express = require('express')
const passport = require('passport')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')

router.get('/users', adminController.getUsers)

router.get('/tweets', adminController.getTweets)
router.delete('/tweets/:tweetId', adminController.deleteTweet)

router.post('/signIn', passport.authenticate('local', { session: false }), adminController.signIn)

module.exports = router

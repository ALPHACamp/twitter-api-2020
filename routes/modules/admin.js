const express = require('express')
const app = require('../../app')
const router = express.Router()
const passport = require('../../config/passport')

const adminController = require('../../controllers/admin-controller')
const userController = require('../../controllers/user-controller')

const { authenticatedAdmin } = require('../../middleware/auth')

router.post('/signin', passport.authenticate('admin-local', { session: false }), userController.signIn)

router.use(authenticatedAdmin)

router.delete('/tweets/:tweetId', adminController.deleteTweet)
router.get('/tweets', adminController.getTweets)
router.get('/users', adminController.getUsers)

module.exports = router

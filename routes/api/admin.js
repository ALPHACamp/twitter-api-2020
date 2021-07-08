const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/api/adminController')
const passport = require('passport')

const authenticatedAdmin = passport.authenticate('jwt', { session: false })

router.post('/login', adminController.login)
router.delete(
  '/tweets/:tweetId',
  authenticatedAdmin,
  adminController.deleteTweet
)
router.get('/users', authenticatedAdmin, adminController.getUsers)
router.get('/tweets', authenticatedAdmin, adminController.getTweets)

module.exports = router

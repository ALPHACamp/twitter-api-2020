// require needed modules
const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth')

// require controller
const adminController = require('../../controllers/admin-controller')

// set router
router.get('/users', authenticated, authenticatedAdmin, adminController.getUsers)
router.delete('/tweets/:id', authenticated, authenticatedAdmin, adminController.deleteTweet)
router.get('/tweets', authenticated, authenticatedAdmin, adminController.getTweets)
router.post('/login', passport.authenticate('local', { session: false }), adminController.login)

module.exports = router

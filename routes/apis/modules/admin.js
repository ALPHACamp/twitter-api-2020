const express = require('express')
const router = express.Router()
const passport = require('../../../config/passport')
const adminController = require('../../../controllers/apis/admin-controllers')
const { authenticated, authenticatedAdmin } = require('../../../middleware/api-auth')

router.post('/signin', passport.authenticate('local', { session: false }), adminController.signIn)
router.get('/users', authenticated, authenticatedAdmin, adminController.getUsers)
router.delete('/tweets/:id', authenticated, authenticatedAdmin, adminController.deleteTweet)
router.get('/tweets', authenticated, authenticatedAdmin, adminController.getTweets)

module.exports = router

const express = require('express')
const router = express.Router()

const passport = require('../../config/passport')

const { authenticated, authenticatedAdmin } = require('../../middleware/auth')

const adminController = require('../../controllers/admin-controller')

router.post('/signin', passport.authenticate('local', { session: false }), adminController.adminSignIn)

router.use(authenticated, authenticatedAdmin)
router.get('/users', adminController.getUsers)

router.get('/tweets', adminController.getTweets)
router.delete('/tweets/:id', adminController.deleteTweet)

module.exports = router

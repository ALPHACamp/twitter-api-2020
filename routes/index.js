const express = require('express')
const router = express.Router()

const { errorHandler } = require('../middleware/error-handler')

const passport = require('../config/passport')

const tweetController = require('../controllers/tweet-controller')
const userController = require('../controllers/user-controller')

router.post('/users/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/users', userController.signUp)
router.use('/', errorHandler)



router.get('/tweets', tweetController.getTweets)


module.exports = router

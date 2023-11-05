const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const admin = require('./modules/admin')
const tweetController = require('../../controllers/apis/tweet-controller')


router.use('/admin', admin)
router.get('/tweets', tweetController.getTweets)


module.exports = router
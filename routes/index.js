const express = require('express')
const router = express.Router()


// 尚未加入 authenticatedAdmin
const { authenticated, authenticatedUser } = require('../middleware/auth')

const tweetController = require('../controllers/tweet-controller')



// Tweet APIs
router.get('/tweets', tweetController.getTweets)



module.exports = router

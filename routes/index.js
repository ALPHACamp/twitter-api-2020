const express = require('express')
const router = express.Router()

const tweetController = require('../controllers/tweet-controller')

// router.post('/users/:id/like', userController.addLike)
// router.delete('/users/:id/unlike', userController.removeLike)
router.get('/api/tweets', tweetController.getTweets)

module.exports = router
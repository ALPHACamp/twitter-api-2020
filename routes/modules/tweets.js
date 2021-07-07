const express = require('express')
const router = express.Router()

const tweetController = require('../../controllers/tweetController')

router.post('/:id/replies', tweetController.postReply)
router.post('/', tweetController.postTweet)


module.exports = router

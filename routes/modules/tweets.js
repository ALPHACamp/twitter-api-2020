const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')

router.post('/:id/like', tweetController.addLike)

module.exports = router
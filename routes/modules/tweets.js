const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')


router.post('/:id/like', tweetController.addLike)
router.post('/:id/unlike', tweetController.removeLike)

module.exports = router
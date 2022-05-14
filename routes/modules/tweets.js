const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller')

router.delete('/:id/unlike', tweetController.removeLike)
router.post('/:id/like', tweetController.addLike)

module.exports = router
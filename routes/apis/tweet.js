const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller.js')

router.post('/:id/like', tweetController.like)
router.post('/:id/unlike', tweetController.unlike)

module.exports = router

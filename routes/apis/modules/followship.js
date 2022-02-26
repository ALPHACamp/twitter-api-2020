const express = require('express')
const router = express.Router()
const { authenticated } = require('../../../middleware/api-auth')
const followshipController = require('../../../controllers/apis/followship-controllers')

// router.delete('/:followingId', authenticated, tweetController.getTweet)
router.post('/', authenticated, followshipController.postFollowship)

module.exports = router

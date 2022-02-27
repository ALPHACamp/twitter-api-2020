const express = require('express')
const router = express.Router()
const { authenticated } = require('../../../middleware/api-auth')
const followshipController = require('../../../controllers/apis/followship-controllers')

// router.delete('/:followingId', authenticated, tweetController.getTweet)
router.delete('/:followingId', authenticated, followshipController.deleteFollowship)
router.post('/', authenticated, followshipController.postFollowship)

module.exports = router

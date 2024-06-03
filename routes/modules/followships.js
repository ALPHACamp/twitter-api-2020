const express = require('express')
const router = express.Router()

const followController = require('../../controllers/follow-controller')

router.get('/tweets', followController.getFollowersTweets)
router.post('/', followController.addFollow)
router.delete('/:followingId', followController.removeFollow)

module.exports = router

const express = require('express')
const router = express.Router()
const likeController = require('../../controllers/like-controller')
const replyController = require('../../controllers/reply-Controller')
const tweetController = require('../../controllers/tweet-controller')

router.post('/:tweet_id/replies', replyController.add)
router.get('/:tweet_id/replies', replyController.getAll)

router.post('/:id/like', likeController.add)
router.post('/:id/unlike', likeController.remove)

router.get('/:tweet_id', tweetController.get)
router.get('/', tweetController.getAll)
router.post('/', tweetController.add)

module.exports = router

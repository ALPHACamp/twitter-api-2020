const express = require('express')
const router = express.Router()
const replyController = require('../../controllers/reply-Controller')
const likeController = require('../../controllers/like-controller')

router.post('/:id/like', likeController.add)
router.post('/:id/unlike', likeController.remove)

router.post('/:tweet_id/replies', replyController.add)
router.get('/:tweet_id/replies', replyController.getAll)

module.exports = router
const express = require('express')
const router = express.Router()
const { authenticated, authenticatedUser } = require('../../middleware/auth')
const userController = require('../../controllers/user-controller')
const likeController = require('../../controllers/like-controller')
const replyController = require('../../controllers/reply-controller')

router.get('/:id/likes', authenticated, likeController.getUserLikes)
router.get('/:id/replies', authenticated, replyController.getUserReplies)
router.get('/:id', authenticated, userController.getUser)
router.get('/')


module.exports = router
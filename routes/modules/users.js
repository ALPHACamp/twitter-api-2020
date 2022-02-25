const express = require('express')
const router = express.Router()
const { authenticated, authenticatedUser } = require('../../middleware/auth')
const likeController = require('../../controllers/like-controller')

router.get('/:id/likes', authenticated, likeController.getUserLikes)
router.get('/')


module.exports = router
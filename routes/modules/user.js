const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const { authenticated, authenticatedUser } = require('../../middleware/auth')

router.get('/:id/likes', authenticated, authenticatedUser, userController.getLikeTweets)
router.get('/:id/tweets', authenticated, authenticatedUser, userController.getUserTweets)
router.get('/:id', authenticated, authenticatedUser, userController.getUser)
router.put('/:id', authenticated, authenticatedUser, userController.putUser)

module.exports = router

const express = require('express')
const router = express.Router()
const { authenticated, authenticatedUser } = require('../../middleware/auth')
const userController = require('../../controllers/user-controller')

router.get('/:uid/tweets', authenticated, userController.getUserTweets)
router.get('/:uid', authenticated, userController.getUser)


module.exports = router
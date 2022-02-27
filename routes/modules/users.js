const express = require('express')
const router = express.Router()
const { authenticated, authenticatedUser } = require('../../middleware/auth')
const userController = require('../../controllers/user-controller')

router.get('/:id/tweets', authenticated, userController.getUserTweets)
router.get('/:id', authenticated, userController.getUser)
router.post('/:id', authenticated, userController.putUser)


module.exports = router
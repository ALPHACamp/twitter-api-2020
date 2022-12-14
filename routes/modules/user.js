const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
router.put('/:userId', userController.editUser)
router.get('/:userId/tweets', userController.getUserTweets)
router.get('/:userId/replied_tweets', userController.getUserReplies)
router.get('/:userId', userController.getUser)
router.get('/?top=', userController.getTopUsers)
router.get('/', userController.getUsers)

module.exports = router

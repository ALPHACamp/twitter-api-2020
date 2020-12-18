const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')

const { authUserSelf } = require('../middleware/auth')

router.get('/top', userController.readTopUsers)
router.get('/:id/tweets', userController.readTweets)
router.get('/:id/replied_tweets', userController.readRepliedTweets)
router.get('/:id/likes', userController.readLikes)
router.get('/:id/followings', userController.readFollowings)
router.get('/:id/followers', userController.readFollowers)
router.get('/:id/', userController.readUser)
router.put('/:id/', authUserSelf, userController.updateUser)

module.exports = router

const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')

router.get('/tweets', userController.readTweets)
router.get('/replied_tweets', userController.readRepliedTweets)
router.get('/likes', userController.readLikes)
router.get('/followings', userController.readFollowings)
router.get('/followers', userController.readFollowers)
router.get('/', userController.readUser)
router.put('/', userController.updateUser)

module.exports = router

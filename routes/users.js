const router = require('express').Router()
const userController = require('../controllers/userController')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet

router.get('/:id', userController.userHomePage)

router.get('/:id/tweets', userController.getUserTweets)

router.get('/:id/replied_tweets', userController.getRepliedTweets)

router.get('/:id/likes', userController.getLikes)

module.exports = router
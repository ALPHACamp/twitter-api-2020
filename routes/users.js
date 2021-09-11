const router = require('express').Router()
const userController = require('../controllers/userController')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet

router.get('/', userController.userHomePage)

router.get('/:id/tweets', userController.getUserTweets)

module.exports = router
const router = require('express').Router()
const tweetController = require('../controllers/tweetController')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet

router.get('/', tweetController.homePage)

module.exports = router
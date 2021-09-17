const express = require('express')
const router = express.Router()
const followshipController = require('../../controllers/followshipController')

// 新增 POST /followships

router.post('/', followshipController.addFollow)

router.get('/', followshipController.getTweets)

router.get('/:tweet_id', followshipController.getTweet)

module.exports = router

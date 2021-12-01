// 載入所需套件
const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweetController')
const { authenticated, checkNotAdmin } = require('../../middlewares/auth')

router.post('/', authenticated, checkNotAdmin, tweetController.postTweet)

// router exports
module.exports = router
const express = require('express')
const { replyTweet } = require('../controllers/api/tweetController')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('chat')
})



module.exports = router
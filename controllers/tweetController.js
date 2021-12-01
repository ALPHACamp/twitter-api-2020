// 載入所需套件
const tweetService = require('../services/tweetService')

const tweetController = {
  postTweet: (req, res) => {
    tweetService.postTweet(req, res, data => {
      return res.json(data)
    })
  }
}

// tweetService exports
module.exports = tweetController
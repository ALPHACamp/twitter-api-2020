const { Like, Tweet, User } = require('../models')

const tweetController = {
  getTweets: (req, res, next) => {
    return Tweet.findAll({ raw:true })
    .then(tweets => {
      data = tweets.sort((a, b) => b.createdAt - a.createdAt)
      console.log('暫時移除中介軟體、檢查data是否為陣列', data)
      res.json({ 
        status: 'success',
        data
      })
    })
    .catch(err => next(err))
  },
  getTweet: (req, res, next) => {
  },
  postTweet:(req, res, next) => {
  },
  likeTweet:(req, res, next) => {
  },
  unlikeTweet:(req, res, next) => {
  }
}

module.exports = tweetController
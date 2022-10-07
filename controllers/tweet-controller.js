const tweetServices = require('../services/tweet-services')

const tweetController = {
  getTweets: (req, res, next) => {
    tweetServices.getTweets(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', data }))
  },
  getTweet: (req, res, next) => {
    tweetServices.getTweet(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', data }))
  },
  postTweet: (req, res, next) => {
    tweetServices.postTweet(req, (err, data) => err
      ? next(err)
      : res.status(200).json({
        status: 'success',
        message: '成功新增推文',
        data
      }))
  },
  likeTweet: (req, res, next) => {
    tweetServices.likeTweet(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', data }))
  },
  unlikeTweet: (req, res, next) => {
    tweetServices.likeTweet(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', data }))
  }
}

module.exports = tweetController

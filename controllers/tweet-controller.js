const tweetServices = require('../services/tweet-services')

const tweetController = {
  getTweets: (req, res, next) => {
    tweetServices.getTweets(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getTweet: (req, res, next) => {
    tweetServices.getTweet(req, (err, data) => err ? next(err) : res.status(200).json(data))
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
    tweetServices.likeTweet(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  unlikeTweet: (req, res, next) => {
    tweetServices.unlikeTweet(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  postReply: (req, res, next) => {
    tweetServices.postReply(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getReplies: (req, res, next) => {
    tweetServices.getReplies(req, (err, data) => err ? next(err) : res.status(200).json(data))
  }
}

module.exports = tweetController

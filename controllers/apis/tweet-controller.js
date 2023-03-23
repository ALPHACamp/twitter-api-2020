const tweetServices = require('../../services/tweet-services')

const tweetController = {
  getTweets: (req, res, next) => {
    tweetServices.getTweets(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getTweet: (req, res, next) => {
    tweetServices.getTweet(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  postTweet: (req, res, next) => {
    tweetServices.postTweet(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getTweetReplies: (req, res, next) => {
    tweetServices.getTweetReplies(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  replyTweet: (req, res, next) => {
    tweetServices.replyTweet(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  likeTweet: (req, res, next) => {
    tweetServices.likeTweet(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', messages: '已成功like推文', data }))
  },
  unlikeTweet: (req, res, next) => {
    tweetServices.unlikeTweet(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', messages: '已成功unlike推文', data }))
  }
}

module.exports = tweetController

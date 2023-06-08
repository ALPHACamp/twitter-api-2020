const tweetServices = require('../../services/tweet-services')

const tweetController = {
  getTweet: (req, res, next) => {
    tweetServices.getTweet(req, (err, data) => err ? next(err) : res.json(data))
  },
  getTweets: (req, res, next) => {
    tweetServices.getTweets(req, (err, data) => err ? next(err) : res.json(data))
  },
  postTweet: (req, res, next) => {
    tweetServices.postTweet(req, (err, data) => err ? next(err) : res.json(data))
  },
  getTweetReplies: (req, res, next) => {
    tweetServices.getTweetReplies(req, (err, data) => err ? next(err) : res.json(data))
  },
  postTweetReplies: (req, res, next) => {
    tweetServices.postTweetReplies(req, (err, data) => err ? next(err) : res.json(data))
  },
  postTweetLike: (req, res, next) => {
    tweetServices.postTweetLike(req, (err, data) => err ? next(err) : res.json(data))
  }
}

module.exports = tweetController

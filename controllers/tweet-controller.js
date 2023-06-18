const tweetServices = require('../services/tweet-services')

const tweetController = {
  getTweets: async(req, res, next) => {
    tweetServices.getTweets(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getTweet: async(req, res, next) => {
    tweetServices.getTweet(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  postTweets: async(req, res, next) => {
    tweetServices.postTweets(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  addLike: async(req, res, next) => {
    tweetServices.addLike(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  removeLike: async (req, res, next) => {
    tweetServices.removeLike(req, (err, data) => err ? next(err) : res.status(200).json(data))
  }
}

module.exports = tweetController
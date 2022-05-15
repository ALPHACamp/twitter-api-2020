const tweetServices = require('../services/tweet-services')

const tweetController = {
  addLike: (req, res, next) => {
    tweetServices.addLike(req, (err, addlike) => err ? next(err) : res.json(addlike))
  },
  removeLike: (req, res, next) => {
    tweetServices.removeLike(req, (err, removelike) => err ? next(err) : res.json(removelike))
  },
  postTweet: (req, res, next) => {
    tweetServices.postTweet(req, (err, newtweet) => err ? next(err) : res.json(newtweet))
  },
  getTweets: (req, res, next) => {
    tweetServices.getTweets(req, (err, tweets) => err ? next(err) : res.json(tweets))
  },
  getTweet: (req, res, next) => {
    tweetServices.getTweet(req, (err, tweet) => err ? next(err) : res.json(tweet))
  }
}

module.exports = tweetController
const tweetsServices = require('../services/tweet-services')
const tweetController = {
  getTweets: (req, res, next) => {
    tweetsServices.getTweets(req, (err, data) => err ? next(err) : res.json(data))
  },
  getTweet: (req, res, next) => {
    tweetsServices.getTweet(req, (err, data) => err ? next(err) : res.json(data))
  },
  postTweet: (req, res, next) => {
    tweetsServices.postTweet(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getReplies: (req, res, next) => {
    tweetsServices.getReplies(req, (err, data) => err ? next(err) : res.json(data))
  },
  postReply: (req, res, next) => {
    tweetsServices.postReply(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  postLike: (req, res, next) => {
    tweetsServices.postLike(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  postUnLike: (req, res, next) => {
    tweetsServices.postUnLike(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  }
}
module.exports = tweetController

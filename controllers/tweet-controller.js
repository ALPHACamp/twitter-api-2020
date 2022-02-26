const tweetServices = require('../services/tweet-services')

const tweetController = {
  getTweets: (req, res, next) => {
    tweetServices.getTweets(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  postTweets: (req, res, next) => {
    if (req.body.description.trim().length > 140 || req.body.description.trim().length <= 0) throw new RangeError('貼文內容必須在1-140字內')
    tweetServices.postTweets(req, (err, data) => err
      ? next(err)
      : res.status(200).json({
        status: 'success',
        message: data
      }))
  },
  getTweet: (req, res, next) => {
    tweetServices.getTweet(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  likeTweet: (req, res, next) => {
    tweetServices.likeTweet(req, (err, data) => err
      ? next(err)
      : res.status(200).json({
        status: 'success',
        message: data
      }))
  },
  unlikeTweet: (req, res, next) => {
    tweetServices.unlikeTweet(req, (err, data) => err
      ? next(err)
      : res.status(200).json({
        status: 'success',
        message: data
      }))
  },
  addReply: (req, res, next) => {
    if (req.body.comment.trim().length > 140 || req.body.comment.trim().length <= 0) throw new RangeError('回復內容必須在1-140字內')
    tweetServices.addReply(req, (err, data) => err
      ? next(err)
      : res.status(200).json({
        status: 'success',
        message: data
      }))
  },
  getReplies: (req, res, next) => {
    tweetServices.getReplies(req, (err, data) => err ? next(err) : res.status(200).json(data))
  }
}

module.exports = tweetController

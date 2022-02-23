const tweetServices = require('../services/tweet-services')

const tweetController = {
  getTweets: (req, res, next) => {
    tweetServices.getTweets(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  postTweets: (req, res, next) => {
    if (req.body.description.trim().length > 140 || req.body.description.trim().length <= 0) throw new RangeError('輸入貼文內容必須在1-140字內')
    tweetServices.postTweets(req, (err, data) => err
      ? next(err)
      : res.status(200).json({
        status: 'success',
        message: data
      }))
  },
  getTweet: (req, res, next) => {
    tweetServices.getTweet(req, (err, data) => err ? next(err) : res.status(200).json(data))
  }
}

module.exports = tweetController

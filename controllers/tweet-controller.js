const tweetServices = require('../services/tweet-services')

const tweetController = {
  postTweet: (req, res, next) => {
    tweetServices.postTweet(req, (err, data) => err ? next(err) : res.status(200).json(data))
  }
}
module.exports = tweetController
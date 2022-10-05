const { Tweet } = require('../models')

const tweetController = {
  getTweets: (req, res, next) => {
    Tweet.findAll({})
      .then(tweets => {
        res.json({ status: 'success', data: { tweets } })
      })
      .catch(err => next(err))
  }
}

module.exports = tweetController

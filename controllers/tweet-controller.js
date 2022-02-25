const { Tweet, User } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      order: [[ 'createdAt', 'DESC' ]]
    })
      .then(tweets => {
        res.status(200).json(tweets)
      })
      .catch(err => next(err))
  },
  // getTweet: (req, res, next) => {

  // },
  // postTweet: (req, res, next) => {

  // }
}

module.exports = tweetController
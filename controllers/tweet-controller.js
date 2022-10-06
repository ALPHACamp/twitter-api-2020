const { Like, Tweet, User } = require('../models')

const tweetController = {
  getTweets: (req, res, next) => {
    console.log('推送前記得掛上中介軟體')
    return Tweet.findAll({
      attributes: { exclude:[ 'updatedAt' ] },
      include: [{
        model: User,
        attributes: [ 'id', 'account', 'name', 'avatar' ]
      }, {model: Like}],
      nest: true,
      // raw: true
    })
    .then(tweets => {
      data = tweets.sort((a, b) => b.createdAt - a.createdAt)
      res.json(data)
    })
    .catch(err => next(err))
  },
  getTweet: (req, res, next) => {
  },
  postTweet:(req, res, next) => {
  },
  likeTweet:(req, res, next) => {
  },
  unlikeTweet:(req, res, next) => {
  }
}

module.exports = tweetController
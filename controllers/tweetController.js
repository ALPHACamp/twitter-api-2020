const db = require('../models')
const Tweet = db.Tweet
const User = db.User

const tweetController = {
  getTweets: (req, res) => {
    Tweet.findAll({
      include: User,
      order: [
        ['createdAt', 'DESC']
      ]
    }).then(tweet => {
      const tweetdata = tweet.map(tweet => ({
        ...tweet.dataValues,
        name: tweet.User.name,
        avatar: tweet.User.avatar,
        account: tweet.User.account,
      }))
      res.json(tweetdata)
    })
  }
}

module.exports = tweetController
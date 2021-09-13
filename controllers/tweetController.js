const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply

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
  },
  getTweet: (req, res) => {
    return Tweet.findByPk(req.params.tweet_id, {
      include: [
        User,
        { model: Reply, include: [User] }
      ]
    }).then(tweet => {
      res.json(tweet)
    })
  }
}

module.exports = tweetController
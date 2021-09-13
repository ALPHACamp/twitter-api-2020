const helpers = require('../_helpers')
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
  },
  postTweet: (req, res) => {
    if (!req.body.description) {
      const data = { status: 'error', message: "content didn't exist" }
      return res.json(data)
    }
    Tweet.create({
      UserId: helpers.getUser(req).id,
      description: req.body.description
    }).then(() => {
      const data = { status: 'success', message: 'a new tweet was successfully posted' }
      res.json(data)
    })
  }
}

module.exports = tweetController
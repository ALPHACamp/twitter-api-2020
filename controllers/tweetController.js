const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like
const helpers = require('../_helpers')

const tweetController = {
  getTweets: (req, res) => {
    Tweet.findAll({
      include: [
        User,   // Tweet belongsTo User
        { model: User, as: 'LikedUsers' },    // Tweet belongsToMany User, through Like
        { model: User, as: 'RepliedUsers' }   // Tweet belongsToMany User, through Reply
      ],
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        tweets = tweets.map(tweet => ({
          tweet,
          repliedCount: tweet.RepliedUsers.length,
          likedCount: tweet.LikedUsers.length
        }))
        res.json(tweets)
      })
  },
  getTweet: (req, res) => {
    Tweet.findByPk(req.params.id, {
      include: [
        User,
        { model: User, as: 'LikedUsers' },
        { model: User, as: 'RepliedUsers' }
      ]
    }).then(tweet => {
      tweet.dataValues.likedCount = tweet.LikedUsers.length
      tweet.dataValues.repliedCount = tweet.RepliedUsers.length
      return res.json(tweet)
    })
  },
  postTweet: (req, res) => {
    if (!req.body.description) {
      return res.json({ status: 'error', message: '內容不可空白' })
    }
    Tweet.create({
      description: req.body.description,
      UserId: helpers.getUser(req).id
    })
    return res.json({ status: 'success', message: "" })
  },
  getAdminTweets: (req, res) => {
    Tweet.findAll({
      include: User,
      order: [['createdAt', 'DESC']]
    }).then(tweets => {
      tweets = tweets.map(tweet => ({
        id: tweet.id,
        description50: tweet.description.slice(0,50),
        createdAt: tweet.createdAt,
        User: tweet.User
      }))
      return res.json(tweets)
    })
  }
}

module.exports = tweetController
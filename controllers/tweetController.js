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
      order: ['createdAt']
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
}

module.exports = tweetController
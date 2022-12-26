const { User, Tweet } = require('./../models')
const sequelize = require('sequelize')
const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')

const adminServices = {
  loginAdmin: (req, cb) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      if (userData.role === 'user') throw new Error('帳號不存在!')
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      cb(null, {
        success: true,
        token,
        admin: userData
      })
    } catch (err) {
      cb(err)
    }
  },
  getUsers: (req, cb) => {
    return User.findAll({
      attributes: ['id', 'account', 'name', 'email', 'avatar', 'cover',
        [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE user_id = User.id)'), 'tweetCount'],
        [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE user_id = User.id)'), 'replyCount'],
        [sequelize.literal('(SELECT COUNT(*) FROM Tweets JOIN Likes ON Tweets.id = Likes.tweet_id WHERE Tweets.user_id = User.id)'), 'likeCount'],
        [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE following_id = User.id)'), 'followerCount'],
        [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE follower_id = User.id)'), 'followingCount']
      ],
      order: [[sequelize.literal('tweetCount'), 'DESC']]
    })
      .then(users => {
        return cb(null, users)
      })
      .catch(err => cb(err))
  },
  deleteTweet: (req, cb) => {
    const TweetId = req.params.tweetId
    return Tweet.findByPk(TweetId)
      .then(tweet => {
        if (!tweet) throw new Error('推文不存在!')
        return tweet.destroy()
      })
      .then(deletedTweet => cb(null, { success: true, deletedTweet })
      )
      .catch(err => cb(err))
  }
}
module.exports = adminServices

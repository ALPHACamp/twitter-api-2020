const { User, Tweet, sequelize, Like, Reply } = require('../models')
const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')

const adminController = {
  signIn: (req, res, next) => {
    try {
      const userData = helpers.getUser(req)?.toJSON()
      if (userData.role !== 'admin') {
        throw new Error('帳號不存在')
      }
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
      res.json({
        token,
        userData
      })
    } catch (err) {
      next(err)
    }
  },
  getUsers: (req, res, next) => {
    User.findAll({
      attributes: {
        include: [
          [sequelize.literal(
            '(SELECT COUNT(*) FROM Followships AS Followers WHERE following_id = user.id )'
          ), 'followerCounts'],
          [sequelize.literal(
            '(SELECT COUNT(*) FROM Followships AS Followings WHERE follower_id = user.id )'
          ), 'followingCounts'],
          [sequelize.literal(
            '(SELECT COUNT(*) FROM Tweets WHERE User_id = user.id)'
          ), 'tweetCounts'],
          [sequelize.literal(
            '(SELECT COUNT(*) FROM Likes INNER JOIN Tweets ON Tweets.id = Likes.tweet_id WHERE Tweets.User_id = User.id)'
          ), 'likeCounts']
        ],
        exclude: ['password', 'email', 'introduction', 'updatedAt']
      },
      order: [
        [sequelize.literal('tweetCounts'), 'DESC'],
        [sequelize.literal('likeCounts'), 'DESC']]
    })
      .then(users => {
        res.json(users)
      })
      .catch(err => next(err))
  },
  deleteTweet: (req, res, next) => {
    const TweetId = req.params.id
    Promise.all([
      Tweet.findByPk(TweetId),
      Like.destroy({ where: { TweetId } }),
      Reply.destroy({ where: { TweetId } })
    ])
      .then(([tweet, likes, replies]) => {
        if (!tweet) return res.status(404).json({ status: 'error', message: '此貼文不存在' })
        return tweet.destroy()
      })
      .then(deletetweet => { res.json(deletetweet) })
      .catch(err => next(err))
  },
  getTweets: (req, res, next) => {
    Tweet.findAll({
      include: [{ model: User, attributes: ['id', 'account', 'name', 'profilePhoto'] }],
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        res.json(tweets)
      })
      .catch(err => next(err))
  }
}

module.exports = adminController

const { User, Tweet, sequelize } = require('../models')
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
          ), 'followerCount'],
          [sequelize.literal(
            '(SELECT COUNT(*) FROM Followships AS Followings WHERE follower_id = user.id )'
          ), 'followingCount'],
          [sequelize.literal(
            '(SELECT COUNT(*) FROM Tweets WHERE User_id = user.id)'
          ), 'tweetsCount'],
          [sequelize.literal(
            '(SELECT COUNT(*) FROM Likes INNER JOIN Tweets ON Tweets.id = Likes.tweet_id WHERE Tweets.User_id = User.id)'
          ), 'likesCount']
        ],
        exclude: ['password', 'email', 'introduction', 'updatedAt']
      },
      order: [
        [sequelize.literal('tweetsCount'), 'DESC'],
        [sequelize.literal('likesCount'), 'DESC']]
    })
      .then(users => {
        res.json(users)
      })
      .catch(err => next(err))
  },
  deleteTweet: (req, res, next) => {
    const id = req.params.id
    Tweet.findByPk(id)
      .then(tweet => {
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

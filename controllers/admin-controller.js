const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')
const { Tweet, User, Like, Reply } = require('../models')
const Sequelize = require('sequelize')

const adminController = {
  signIn: (req, res, next) => {
    const userData = helpers.getUser(req).toJSON()
    const JWTSecret = process.env.JWT_SECRET || 'SECRET'
    delete userData.password
    if (userData.role === 'user') {
      const err = new Error('帳號不存在！')
      err.status = 404
      throw err
    }
    try {
      const token = jwt.sign(userData, JWTSecret, { expiresIn: '30d' })
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },

  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        attributes: [
          'id',
          'UserId',
          // 使用 SQL 語法抓出 description 前 50 個字
          [Sequelize.literal('SUBSTRING(description, 1, 50)'), 'description'],
          'createdAt',
          'updatedAt'
        ],
        include: [
          { model: User, attributes: { exclude: ['password'] } }
        ],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })

      return res.json(tweets)
    } catch (err) {
      return next(err)
    }
  },

  deleteTweet: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id)
      if (!tweet) {
        const err = new Error('推文不存在!')
        err.status = 404
        throw err
      }
      const deletedTweet = await tweet.destroy()
      await Reply.destroy({ where: { TweetId: req.params.id } })
      await Like.destroy({ where: { TweetId: req.params.id } })

      return res.json({ status: 'success', data: { deletedTweet } })
    } catch (err) {
      return next(err)
    }
  },

  getUsers: (req, res, next) => {
    const likesCount = array => {
      let sum = 0
      for (const i of array) {
        sum += i.Likes.length
      }
      return sum
    }

    return User.findAll({
      attributes: { exclude: ['password'] },
      include: [
        { model: Tweet, include: Like },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
      .then(users => {
        const result = users.map(user => ({
          ...user.toJSON(),
          tweetsCount: user.Tweets.length,
          getLikesCount: likesCount(user.Tweets),
          followersCount: user.Followers.length,
          followingsCount: user.Followings.length
        }))
          .sort((a, b) => b.tweetsCount - a.tweetsCount)

        result.forEach(item => {
          delete item.Tweets
          delete item.Followers
          delete item.Followings
        })

        res.json(result)
      })
      .catch(err => next(err))
  },
  getAuth: (req, res, next) => {
    helpers.getUser(req) ? res.json({ status: 'success', message: `User role is ${helpers.getUser(req).role}` }) : res.status(401).json({ status: 'error', message: 'unauthorized' })
  }
}

module.exports = adminController

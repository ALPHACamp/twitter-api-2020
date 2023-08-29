const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')
const { Tweet, User, Like, Reply } = require('../models')

const adminController = {
  signIn: (req, res, next) => {
    const userData = helpers.getUser(req)
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

  getTweets: (req, res, next) => {
    return Tweet.findAll({
      include: [
        // 查詢 password 欄位以外的 user 資料
        { model: User, attributes: { exclude: ['password'] } }
      ],
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(tweets => {
        const data = tweets.map(tweet => ({
          ...tweet,
          description: tweet.description.substring(0, 50)
        }))
        res.json(data)
      })
      .catch(err => next(err))
  },

  deleteTweet: (req, res, next) => {
    return Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) {
          const err = new Error('推文不存在!')
          err.status = 404
          throw err
        }

        return Promise.all([
          tweet.destroy(),
          Reply.destroy({ where: { TweetId: req.params.id } }),
          Like.destroy({ where: { TweetId: req.params.id } })
        ])
      })
      .then(([deletedTweet, deletedReplies, deleteLikes]) => {
        res.json({ status: 'success', data: { deletedTweet } })
      })
      .catch(err => next(err))
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

const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')
const { Tweet, User, Like } = require('../models')

const adminController = {
  signIn: (req, res, next) => {
    const userData = helpers.getUser(req).toJSON()
    delete userData.password
    if (userData.role === 'user') {
      const err = new Error('帳號不存在！')
      err.status = 404
      throw err
    }
    try {
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
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
        res.json(tweets)
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

        return tweet.destroy()
      })
      .then(tweet => {
        res.json({ status: 'success', data: { tweet } })
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
        result.forEach(item => {
          delete item.Tweets
          delete item.Followers
          delete item.Followings
        })

        res.json(result)
      })
      .catch(err => next(err))
  }
}

module.exports = adminController

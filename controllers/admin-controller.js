const bcrypt = require('bcryptjs')
const { User, Reply, Like, Tweet, sequelize } = require('../models')
const jwt = require('jsonwebtoken')
// const tweet = require('../models/tweet')

const adminController = {
  login: async (req, res, next) => {
    try {
      const error = new Error()
      const { account, password } = req.body

      if (!account || !password) {
        error.code = 400
        error.message = '有欄位沒填寫到'
        throw error
      }

      const user = await User.findOne({ where: { account } })

      if (!user || user.role === 'user') {
        error.code = 403
        error.message = '帳號不存在'
        throw error
      }

      if (!bcrypt.compareSync(password, user.password)) {
        error.code = 403
        error.message = '帳號或密碼錯誤'
        throw error
      }

      const userData = user.toJSON()
      delete userData.password
      const token = jwt
        .sign(
          userData,
          process.env.JWT_SECRET,
          { expiresIn: '30d' }
        )
      return res.json({
        status: 'success',
        token,
        data: userData,
        message: '登入成功'
      })
    } catch (err) {
      err.code = 500
      return next(err)
    }
  },
  deleteTweet: async (req, res, next) => {
    try {
      const error = new Error()
      const tweet = await Tweet.findByPk(req.params.id)

      if (!tweet) {
        error.code = 404
        error.message = '對應推文不存在'
        throw error
      }

      await Reply.destroy({ where: { TweetId: tweet.id } })
      await Like.destroy({ where: { TweetId: tweet.id } })
      await tweet.destroy()
      return res.json({
        status: 'success',
        message: '成功刪除貼文'
      })
    } catch (err) {
      err.code = 500
      return next(err)
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const error = new Error()
      const users = await User.findAll({
        attributes: [
          'id',
          'account',
          'name',
          'avatar',
          'cover',
          'introduction',
          'followerCount',
          'followingCount',
          'likeCount',
          [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.UserId = User.id)'), 'replyCount']
        ],
        order: [['TweetCount', 'DESC']]
      })
      return res.status(200).json(...[users])
    } catch (err) {
      err.code = 500
      return next(err)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        attributes: [
          'id',
          'updatedAt',
          'description'
        ],
        include: [
          {
            model: User,
            attributes: [
              'name',
              'account',
              'avatar'
            ]
          }
        ],
        order: [['createdAt', 'DESC']]
      })
      const results = tweets.map(item => {
        const result = item.toJSON()
        result.description = result.description.substring(0, 50)
        return result
      })
      return res.status(200).json(results)
    } catch (err) {
      err.code = 500
      return next(err)
    }
  }
}

module.exports = adminController

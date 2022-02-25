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
  // 刪除指定推文
  deleteTweet: async (req, res, next) => {
    try {
      const error = new Error()
      const tweet = await Tweet.findByPk(req.params.id)

      // 找不到推文
      if (!tweet) {
        error.code = 404
        error.message = '對應推文不存在'
        throw error
      }

      // 可以找到推文刪除
      await Reply.destroy({ where: { TweetId: tweet.id } })
      await Like.destroy({ where: { TweetId: tweet.id } })
      // 成功刪除
      return res.json({
        status: 'success',
        message: '成功刪除貼文',
        data: await tweet.destroy()
      })
    } catch (err) {
      // 系統出錯
      err.code = 500
      return next(err)
    }
  },
  // 獲取所有使用者
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
      // 系統出錯
      err.code = 500
      return next(err)
    }
  },
  // 獲取所有推文
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
      // 獲取成功
      return res.status(200).json(results)
    } catch (err) {
      // 系統出錯
      err.code = 500
      return next(err)
    }
  }
}

module.exports = adminController

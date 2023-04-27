const jwt = require('jsonwebtoken')
const db = require('../models')
const { User, Tweet, sequelize } = db
const helpers = require('../_helpers')
const { Op } = require("sequelize")

const adminController = {
  signIn: async (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      delete userData.password
      const token = await jwt.sign(userData, 'secret', { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
      res.json({
        status: 'success',
        message: '成功登入',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const data = await User.findAll({
        // where: { [Op.not]: [{ role: 'admin' }] },
        attributes: [
          'id', 'account', 'name', 'email', 'avatar', 'cover',
          [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE user_id = User.id)'), 'TweetsCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE user_id = User.id)'), 'LikesCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE following_id = User.id)'), 'FollowingCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE follower_id = User.id)'), 'FollowerCount']
        ],
        order: [[sequelize.literal('TweetsCount'), 'DESC']],
        raw: true,
        nest: true
      })
      if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'travis') {
        res.json(data)
      } else {
        res.status(200).json({
          status: 'Success',
          message: '成功取得所有使用者之資料',
          data
        })
      }
    } catch (err) {
      next(err)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        order: [['createdAt', 'DESC']],
        include: {
          model: User,
          attributes: {
            exclude: ['password']
          }
        },
        raw: true,
        nest: true
      })
      const data = await tweets.map(tweet => ({
        ...tweet,
        description: tweet.description.substring(0, 50)
      }))
      res.json({
        status: 'success',
        message: '成功取得所有推文資料',
        tweets: data
      })
    } catch (err) {
      next(err)
    }
  },
  deleteTweet: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id)
      if (!tweet) throw new Error("這篇推文不存在")
      await tweet.destroy()
      res.json({
        status: 'success',
        message: '成功刪除',
        data: tweet
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController

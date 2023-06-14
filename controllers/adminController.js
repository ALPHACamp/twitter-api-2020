const jwt = require('jsonwebtoken')
const sequelize = require('sequelize')
const { getUser } = require('../_helpers')
const { User, Tweet } = require('../models')
const adminController = {
  login: async (req, res, next) => {
    try {
      // get user data
      const userData = getUser(req)?.toJSON()
      const tokenData = Object.assign({}, { id: userData.id })
      delete userData.password

      // sign token
      const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
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
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        attributes: ['id', 'name', 'account', 'avatar', 'cover',
          // 推文數量
          [
            sequelize.literal('(SELECT COUNT(id) FROM Tweets WHERE Tweets.UserId = User.id)'), 'tweetCount'
          ],
          // 關注人數(跟隨user的人數)
          [sequelize.literal('(SELECT COUNT(id) FROM Followships WHERE Followships.followingId = User.id)'),
            'follower'],
          // 跟隨者人數(user追蹤的人數)
          [sequelize.literal('(SELECT COUNT(id) FROM Followships WHERE Followships.followerId = User.id)'),
            'following'],
          // 推文被 like 的數量
          [sequelize.literal('(SELECT COUNT(id) FROM Likes WHERE Likes.UserId = User.id and Likes.isLiked = true)'), 'likeCount']
        ],
        // 按推文數排序，由多至少
        order: [[sequelize.literal('tweetCount'), 'DESC'], ['createdAt']],
        raw: true,
        nest: true
      })
      res.status(200).json(users)
    } catch (err) {
      next(err)
    }
  },
  deleteTweet: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id)
      if (!tweet) return res.status(404).json({ status: 'error', messages: '推文不存在' })
      await tweet.destroy()
      res.status(200).json({ status: 'success', message: '刪除成功' })
    } catch (err) { next(err) }
  }
}
module.exports = adminController

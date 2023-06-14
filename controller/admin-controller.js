const helpers = require('../_helpers')
const { User, Tweet, Sequelize } = require('../models')
const jwt = require('jsonwebtoken')

const adminController = {
  signIn: async (req, res, next) => {
    try {
      const userJSON = helpers.getUser(req).toJSON()
      if (userJSON.role !== 'admin') throw new Error('帳號不存在')
      const token = jwt.sign(userJSON, process.env.JWT_SECRET, { expiresIn: '30d' })// 簽證效期30天
      return res.status(200).json({ token, message: '登入成功!' })
    } catch (err) { next(err) }
  },
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({ attributes: { exclude: ['password'] } })
      return res.status(200).json(users)
    } catch (err) { next(err) }
  },
  deleteTweet: async (req, res, next) => {
    try {
      const tweetId = req.params.id
      const tweet = await Tweet.findByPk(tweetId)
      if (!tweet) throw new Error('This tweet is not exist!')
      await tweet.destroy()
      return res.status(200).json({ message: '此推文成功刪除' })
    } catch (err) { next(err) }
  },
  getTweetList: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        include: { model: User, attributes: ['id', 'email', 'name', 'account', 'avatar', 'cover'] },
        attributes: [
          'id',
          [Sequelize.literal('SUBSTRING(description, 1,50)'), 'shortDescription'],
          'createdAt',
          'updatedAt'
        ],
        order: [['createdAt', 'DESC']]
      })
      return res.status(200).json(tweets)
    } catch (err) { next(err) }
  }
}

module.exports = adminController

const helpers = require('../_helpers')
const { User, Tweet, Like } = require('../models')
const jwt = require('jsonwebtoken')
const { Sequelize } = require('sequelize')

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
      const users = await User.findAll({
        attributes: { exclude: ['password'] },
        include: [
          { model: Tweet, attributes: ['id'], include: { model: Like, attributes: ['id'] } },
          { model: User, as: 'Followings', attributes: ['id'] },
          { model: User, as: 'Followers', attributes: ['id'] }
        ]
      })
      const result = users.map(u => ({
        ...u.toJSON(),
        TweetsCount: u.Tweets.length,
        FollowingsCount: u.Followings.length,
        FollowersCount: u.Followers.length,
        TweetsLikedCount: u.Tweets.reduce((acc, tweet) => acc + tweet.Likes.length, 0)
      }))
      result.forEach(r => {
        delete r.Tweets
        delete r.Followings
        delete r.Followers
      })
      result.sort((a, b) => b.TweetsCount - a.TweetsCount)
      return res.status(200).json(result)
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

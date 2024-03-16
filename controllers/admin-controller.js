const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')
const dayjs = require('dayjs')
const { User, Tweet, sequelize } = require('../models')
const { sanitizedInput, checkUriParam } = require('../helpers/sanitized')
const adminController = {

  signIn: (req, res, next) => {
    try {
      const loginUser = helpers.getUser(req).toJSON()
      if (loginUser?.role === 'user') return res.status(403).json({ status: 'error', message: 'Permission denied.' })

      delete loginUser.password
      loginUser.createdAt = dayjs(loginUser.createdAt).valueOf()
      loginUser.updatedAt = dayjs(loginUser.updatedAt).valueOf()

      const token = jwt.sign(loginUser, process.env.JWT_SECRET, { expiresIn: '5d' })

      return res.status(200).json({ status: 'success', data: { token, user: loginUser } })
    } catch (err) { next(err) }
  },

  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }],
        attributes: ['id', 'description', 'createdAt'],
        order: [['createdAt', 'DESC']],
        nest: true,
        raw: true
      })

      const data = tweets.map(tweet => ({ ...tweet, description: tweet?.description.slice(0, 50), createdAt: dayjs(tweet.createdAt).valueOf() }))

      return res.status(200).json(data)
    } catch (err) { next(err) }
  },

  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        attributes: ['id', 'name', 'account', 'avatar', 'cover',
          [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id)'), 'tweetsCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followerId = User.id)'), 'followingCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)'), 'followerCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Tweets JOIN Likes on Tweets.id = Likes.TweetId WHERE Tweets.UserId = User.id)'), 'tweetsLikedCount']
        ],
        order: [[sequelize.literal('tweetsCount'), 'DESC'], ['name', 'ASC']],
        nest: true,
        raw: true
      })

      return res.status(200).json(users)
    } catch (err) { next(err) }
  },

  deleteTweet: async (req, res, next) => {
    try {
      const reqTweetId = Number(checkUriParam(sanitizedInput(req.params.id)))
      const tweet = await Tweet.findByPk(reqTweetId)
      if (!tweet) return res.status(404).json({ status: 'error', message: 'Tweet does not exist.' })

      await tweet.destroy()

      return res.status(200).json({ status: 'success' })
    } catch (err) { next(err) }
  }
}
module.exports = adminController

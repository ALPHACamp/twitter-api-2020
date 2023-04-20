const { User, Tweet, sequelize } = require('../models')
const createError = require('http-errors')
const timeFormat = require('../helpers/date-helpers')

const adminController = {
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        attributes: ['id', 'account', 'name', 'avatar', 'cover',
          [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.User_id = User.id)'), 'tweetCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.following_id = User.id)'), 'followerCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.follower_id = User.id)'), 'followingCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Tweets JOIN Likes ON Tweets.id = Likes.Tweet_id WHERE Tweets.User_id = User.id)'), 'likeCount']
        ],
        order: [[sequelize.literal('tweetCount'), 'DESC']],
        raw: true
      })

      return res.json(users)
    } catch (error) {
      next(error)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        attributes: { exclude: ['updatedAt'] },
        include: { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
        order: [['createdAt', 'DESC']]
      })
      const result = tweets.map(tweet => ({
        ...tweet.toJSON(),
        description: tweet.description.substring(0, 50),
        createdAt: timeFormat(tweet.createdAt)
      }))

      return res.json(result)
    } catch (error) {
      next(error)
    }
  },
  deleteTweet: async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      const tweet = await Tweet.findByPk(id)

      if (!tweet) throw createError(404, '推文不存在')

      await tweet.destroy()

      return res.json({
        status: 'success',
        message: '推文刪除成功'
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = adminController

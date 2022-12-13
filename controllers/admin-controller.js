const { Tweet, User, sequelize } = require('../models')
const { relativeTime } = require('../helpers/date-helper')

const adminController = {
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        include: {
          model: User, attributes: ['id', 'name', 'account', 'avatar']
        },
        order: [['createdAt', 'DESC']],
        nest: true,
        raw: true
      })

      //  轉換人性化時間
      const newTweets = tweets.map(tweet => ({
        ...tweet,
        createdAt: relativeTime(tweet.createdAt)
      }))

      res.status(200).json(newTweets)
    } catch (err) {
      next(err)
    }
  },
  deleteTweet: async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      const tweet = await Tweet.findByPk(id)

      //  確認將刪除的貼文是否存在
      if (!tweet) {
        return res.status(404).json({
          status: 'error',
          message: '你想刪除的這篇貼文不存在!'
        })
      }
      await tweet.destroy()

      res.status(200).json({ status: 'success' })
    } catch (err) {
      next(err)
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        attributes: [
          'id', 'name', 'account', 'avatar', 'cover',
          [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE UserId = User.id)'), 'tweetCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE UserId = User.id)'), 'replyCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE followingId = User.id)'), 'followerCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE followerId = User.id)'), 'followingCount']
        ],
        order: [[sequelize.literal('tweetCount'), 'DESC']]
      })
      res.status(200).json(users)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController

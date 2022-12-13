const { Tweet, User } = require('../models')
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
  }
}

module.exports = adminController

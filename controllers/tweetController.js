const { Tweet, User } = require('../models')
const moment = require('moment')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const result = await Tweet.findAll({
        raw: true,
        nest: true,
        attributes: ['id', 'description', 'replyCounts', 'likeCounts', 'createdAt'],
        order: [
          ['createdAt', 'DESC']
        ],
        include: [{
          model: User,
          attributes: ['id', 'name', 'account', 'avatar'],
        }]
      })
      // 將取得資料做整理
      const tweets = result.map(tweet => ({
        ...tweet,
        createdAt: moment(tweet.createdAt).format('YYYY-MM-DD kk:mm:ss')
      }))
      return res.json({ status: 'success', tweets })
    } catch (err) {
      next(err)
      return res.json({ status: 'error', message: err.toString() })
    }
  }
}

module.exports = tweetController
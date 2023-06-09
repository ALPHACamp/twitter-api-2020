const { Tweet, User } = require('../models')
const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({ raw: true, nest: true, order: [['createdAt', 'DESC']] })
      return res.json({ status: 'success', data: tweets })
    } catch (err) { next(err) }
  }
}

module.exports = tweetController

const { Tweet, User } = require('../models')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        order: [['createdAt', 'DESC']],
        include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }],
        raw: true,
        nest: true
      })
      if (!tweets.length) return res.status(404).json({ status: 'error', message: 'Tweet is not found' })
      return res.status(200).json(tweets)
    } catch (err) {
      next(err)
    }
  }
}
module.exports = tweetController

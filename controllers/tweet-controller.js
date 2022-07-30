const helpers = require('../_helpers')
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
  },
  addTweet: async (req, res, next) => {
    try {
      const userId = Number(helpers.getUser(req).id)
      const { description } = req.body
      if (!userId || !description) {
        return res.status(400).json({
          status: 'error',
          message: 'userId and description required'
        })
      }

      if (description.length > 140) {
        return res.status(400).json({
          status: 'error',
          message: 'tweet should be within 140 characters'
        })
      }

      await Tweet.create({ userId, description })
      return res.status(200).json({ status: 'success', message: 'New tweet added' })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController

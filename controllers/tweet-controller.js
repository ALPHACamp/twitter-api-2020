const helpers = require('../_helpers')
const { Tweet, User } = require('../models')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        order: [['createdAt', 'DESC']],
        include: [{ model: User, attributes: ['name', 'account', 'avatar'] }],
        raw: true,
        nest: true
      })
      return res.status(200).json(tweets)
    } catch (err) {
      next(err)
    }
  },
  addTweet: async (req, res, next) => {
    const userId = Number(helpers.getUser(req).id)
    const { description } = req.body
    if (!userId || !description) {
      return res.status(400).json({
        status: 'error',
        message: 'userId and description required'
      })
    }

    if (description.length > 140) {
      return res.status(401).json({
        status: 'error',
        message: 'tweet should be within 140 characters'
      })
    }

    const tweet = await Tweet.create({ userId, description })
    return res.status(200).json({
      status: 'success',
      message: '',
      data: tweet.toJSON()
    })
  }
}

module.exports = tweetController

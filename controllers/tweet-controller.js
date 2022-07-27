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
  }
}
module.exports = tweetController

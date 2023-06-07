const { Tweet } = require('../../models')

const tweetController = {
  postTweet: async (req, res, next) => {
    try {
      const { description } = req.body
      const tweet = await Tweet.create({
        UserId: res.locals.userId,
        description
      })
      return res.json({ status: 'success', data: tweet })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = tweetController

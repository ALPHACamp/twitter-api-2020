const { Tweet } = require('../../models')
const { getUser } = require('../../_helpers')

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
  },
  getTweets: async (req, res, next) => {
    try {
      const userTweets = await Tweet.findAll({
        where: { userId: getUser(req).id },
        raw: true,
        nest: true
      })
      if (!userTweets) return res.json({ status: 'error', data: 'You have not post any tweet yet' })
      return res.json({ status: 'success', data: userTweets })
    } catch (error) {
      next(error)
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const { tweet_id } = req.params
      const tweet = await Tweet.findByPk(tweet_id)
      if (!tweet) return res.json({ status: 'error', data: 'The tweet does not exist' })
      return res.json({ status: 'success', data: tweet })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = tweetController

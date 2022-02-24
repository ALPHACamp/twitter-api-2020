const { getUser } = require('../../_helpers')
const { Tweet } = require('../../models')

const tweetController = {
  postTweet: async (req, res, next) => {
    const { description } = req.body
    try {
      if (description.length > 140) throw new Error('推文字數不可大於140字！')
      const tweet = await Tweet.create({
        UserId: getUser(req).id,
        description
      })
      res.json({
        status: 'success',
        data: { tweet: tweet.toJSON() }
      })
    } catch (err) {
      next(err)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        raw: true,
        nest: true
      })
      if (process.env.NODE_ENV === 'test') {
        res.json(tweets)
      }
      res.json({
        status: 'success',
        data: { tweets }
      })
    } catch (err) {
      next(err)
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const tweet = await Tweet.findOne({
        where: { id: req.params.id },
        raw: true,
        nest: true
      })
      if (process.env.NODE_ENV === 'test') {
        res.json(tweet)
      }
      res.json({
        status: 'success',
        data: { tweet }
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController

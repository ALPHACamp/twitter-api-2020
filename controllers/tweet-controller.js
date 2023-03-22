const helper = require('../_helpers')
const { Tweet, User, Reply, Like } = require('../models')

const tweetController = {
  postTweet: async (req, res, next) => {
    try {
      const { description } = req.body
      if (!description) throw new Error('推文不可空白')
      if (description.length > 140) throw new Error('字數限制 140 字')
      const UserId = helper.getUser(req).id
      const newTweet = await Tweet.create({ description, UserId })
      res.status(200).json(newTweet)
    } catch (err) {
      next(err)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
          { model: Reply, attributes: ['id'] },
          { model: Like, attributes: ['id'] }
        ],
        order: [['updatedAt', 'DESC']]
      })
      res.status(200).json(tweets)
    } catch (err) {
      next(err)
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const TweetId = req.params.tweet_id
      const tweet = await Tweet.findByPk(TweetId, {
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
          { model: Reply, attributes: ['id'] },
          { model: Like, attributes: ['id'] }
        ]
      })
      res.status(200).json(tweet)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController

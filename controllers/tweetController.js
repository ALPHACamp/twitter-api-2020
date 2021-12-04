const { Tweet } = require('../models')
const { User } = require('../models')
const { Like } = require('../models')
const { Reply } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweet: async (req, res) => {
    try {
      const tweet = await Tweet.findByPk(req.params.tweet_id, {
        include: [{ model: User }, { model: Like }, { model: Reply }]
      })
      const data = tweet.toJSON()
      const result = {
        id: data.id,
        description: data.description,
        createdAt: data.createdAt,
        User: data.User,
        likeCounts: data.Likes.length,
        replyCounts: data.Replies.length,
        isLike: helpers.getUser(req).Likes ? helpers.getUser(req).Likes.some(like => like.TweetId === data.id) : false
      }
      return res.status(200).json(result)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ status: 'error', message: 'Server error' })
    }
  }
}

module.exports = tweetController

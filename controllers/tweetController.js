const { Tweet, User, Like, Reply } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweets: async (req, res) => {
    try {
      const tweets = await Tweet.findAll({
        include: [{ model: User }, { model: Like }, { model: Reply }]
      })

      let results = tweets.map((tweet) => ({
        id: tweet.dataValues.id,
        description: tweet.dataValues.description,
        createdAt: tweet.dataValues.createdAt,
        User: tweet.dataValues.User.toJSON(),
        likeCounts: tweet.dataValues.Likes.length,
        replyCounts: tweet.dataValues.Replies.length,
        isLike: helpers.getUser(req).Likes ? helpers.getUser(req).Likes.some(like => like.TweetId === tweet.dataValues.id) : false
      }))

      results = results.sort((a, z) => z.createdAt - a.createdAt)

      return res.status(200).json(results)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ status: 'error', message: 'Server error' })
    }
  },
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
  },
  postTweet: async (req, res) => {
    try {
      const { description } = req.body
      await Tweet.create({
        description: description.substring(0, 50),
        UserId: helpers.getUser(req).id
      })
      return res.status(200).json({ status: 'success', message: '成功發送貼文' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ status: 'error', message: 'Server error' })
    }
  }
}

module.exports = tweetController

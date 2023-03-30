const helpers = require('../_helpers')
const { valueTrim } = require('../helpers/obj-helpers')
const { User, Tweet, Reply, Like } = require('../models')

const tweetController = {
  postTweet: async (req, res, next) => {
    try {
      const { description } = valueTrim(req.body)
      if (!description) throw new Error('內容不可空白')
      if (description.length > 140) throw new Error('推文不可超過140字')
      const userId = helpers.getUser(req).id
      const newTweet = await Tweet.create({ description, UserId: userId })
      res.status(200).json(newTweet)
    } catch (err) {
      next(err)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const data = await Tweet.findAll({
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
          { model: Reply, attributes: ['id'] },
          { model: Like, attributes: ['id'] }
        ],
        order: [['updatedAt', 'DESC']]
      })
      const signinUser = helpers.getUser(req)
      const tweets = data.map(d => {
        const tweet = {
          ...d.toJSON(),
          replies: d.Replies.length,
          likes: d.Likes.length,
          isLike: signinUser.Likes ? signinUser.Likes.some(like => like.TweetId === d.id) : false
        }
        delete tweet.Replies
        delete tweet.Likes
        return tweet
      })
      res.status(200).json(tweets)
    } catch (err) {
      next(err)
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const id = req.params.tweet_id
      const data = await Tweet.findByPk(id, {
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
          { model: Reply, attributes: ['id'] },
          { model: Like, attributes: ['id'] }
        ]
      })
      if (!data) throw new Error('推文不存在')
      const signinUser = helpers.getUser(req)
      const tweet = {
        ...data.toJSON(),
        replies: data.Replies.length,
        likes: data.Likes.length,
        isLike: signinUser.Likes ? signinUser.Likes.some(like => like.TweetId === data.id) : false
      }
      delete tweet.Replies
      delete tweet.Likes
      res.status(200).json(tweet)
    } catch (err) {
      next(err)
    }
  },
  addTweetLike: async (req, res, next) => {
    try {
      const tweetId = req.params.id
      const userId = helpers.getUser(req).id
      const tweet = await Tweet.findByPk(tweetId, { raw: true })
      if (!tweet) throw new Error('推文不存在')
      const like = await Like.findOne({ where: { tweetId, userId }, raw: true })
      if (like) throw new Error('已按過喜歡')
      await Like.create({ TweetId: tweetId, UserId: userId })
      res.status(200).end()
    } catch (err) {
      next(err)
    }
  },
  removeTweetLike: async (req, res, next) => {
    try {
      const tweetId = req.params.id
      const userId = helpers.getUser(req).id
      const tweet = await Tweet.findByPk(tweetId, { raw: true })
      if (!tweet) throw new Error('推文不存在')
      const like = await Like.findOne({ where: { tweetId, userId }, attribute: [] })
      if (!like) throw new Error('未按過喜歡')
      await like.destroy()
      res.status(200).end()
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController

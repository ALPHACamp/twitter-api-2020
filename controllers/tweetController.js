const { User, Tweet, Like, Reply } = require('../models')
const helpers = require('../_helpers')

let tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        include: [{ model: User, attributes: ['name', 'avatar', 'account'] }, { model: Like }],
        order: [['createdAt', 'DESC']],
      })
      if (!tweets) throw new Error("there's no tweets in DB")
      return res.json(tweets)
    } catch (error) {
      next(error)
    }
  },

  getTweet: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.tweetId, { include: { model: Reply } })
      if (!tweet) throw new Error("this tweet doesn't exist")
      return res.json(tweet)
    } catch (error) {
      next(error)
    }
  },

  postTweets: async (req, res, next) => {
    try {
      if (!req.body.description) throw new Error('請輸入必填項目')
      if (req.body.description.length > 140) throw new Error('數入字數超過140字')

      const tweet = await Tweet.create({
        description: req.body.description,
        UserId: helpers.getUser(req).id,
      })
      return res.json(tweet)
    } catch (error) {
      next(error)
    }
  },

  putTweet: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.tweetId)
      if (!tweet) throw new Error('Cannot find this tweet')
      await tweet.update({ description: req.body.description })
      return res.json(tweet)
    } catch (error) {
      next(error)
    }
  },

  likeTweet: async (req, res, next) => {
    try {
      const isLiked = await Like.findOne({ where: { UserId: helpers.getUser(req).id, TweetId: req.params.tweetId } })
      if (isLiked) throw new Error('you had already liked this tweet')

      await Like.create({
        UserId: helpers.getUser(req).id,
        TweetId: req.params.tweetId,
      })
      return res.json({ status: 'success', message: 'like this tweet successfully' })
    } catch (error) {
      next(error)
    }
  },

  unlikeTweet: async (req, res, next) => {
    try {
      const isLiked = await Like.findOne({ where: { UserId: helpers.getUser(req).id, TweetId: req.params.tweetId } })
      if (!isLiked) throw new Error('like already been removed')

      await isLiked.destroy()
      return res.json({ status: 'success', message: 'unlike successfully' })
    } catch (error) {
      next(error)
    }
  },
}

module.exports = tweetController

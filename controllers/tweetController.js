const { listen } = require('../app')
const { User, Tweet, Like, Reply } = require('../models')
const helpers = require('../_helpers')
function getData(data) {
  if (data) return data.map(d => d.id)
  return []
}

let tweetController = {
  getTweets: async (req, res, next) => {
    try {
      let tweets = await Tweet.findAll({
        include: [{ model: User, attributes: ['name', 'avatar', 'account'] }, { model: Like }, { model: Reply }],
        order: [['createdAt', 'DESC']],
      })
      if (!tweets) throw new Error("there's no tweets in DB")
      const LikedTweetsId = getData(helpers.getUser(req).LikedTweets)

      tweets = await tweets.map(t => ({
        ...t.dataValues,
        isLiked: LikedTweetsId.length ? LikedTweetsId.includes(t.id) : false,
        replyCount: t.Replies.length,
        likeCount: t.Likes.length,
      }))
      return res.json(tweets)
    } catch (error) {
      next(error)
    }
  },

  getTweet: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.tweetId, { include: { model: Reply, model: Like } })
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

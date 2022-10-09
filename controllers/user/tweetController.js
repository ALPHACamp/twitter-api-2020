const { Tweet, User, Like, Reply } = require('../../models')
const { tweetValidation } = require('../../helper/validations')
const helpers = require('../../_helpers')
const assert = require('assert')

const tweetController = {
  addTweet: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const { value, error } = tweetValidation(req.body)
      const { description } = value
      assert(!error, error?.details[0].message)
      if (!description.trim()) throw new Error('內容不可空白')
      const data = await Tweet.create({
        UserId,
        description
      })
      return res.json({ status: 'success', data })
    } catch (error) {
      next(error)
    }
  },
  getAllTweets: async (req, res, next) => {
    try {
      const data = await Tweet.findAll({
        include: User,
        order: [['createdAt', 'DESC']],
        nest: true,
        raw: true
      })
      return res.json(data)
    } catch (error) {
      next(error)
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const tweetId = req.params.tweet_id
      const [tweetData, likeData, replyData] = await Promise.all([
        Tweet.findByPk(tweetId, {
          include: User,
          nest: true,
          raw: true
        }),
        Like.findAll({ where: { tweetId } }),
        Reply.findAll({ where: { tweetId } })
      ])
      tweetData.likeCount = likeData.length
      tweetData.replyCount = replyData.length
      // return res.json({ status: 'success', data: tweetData })
      return res.json(tweetData)
    } catch (error) {
      next(error)
    }
  },
  addLike: async (req, res, next) => {
    const TweetId = req.params.id
    const UserId = helpers.getUser(req).id

    try {
      const [tweet, user] = await Promise.all([
        Tweet.findByPk(TweetId),
        User.findByPk(UserId)
      ])
      assert(tweet, '貼文不存在')
      assert(user, '使用者不存在')

      const like = await Like.findOne({ where: { TweetId, UserId } })
      assert(!like, '不可重複喜歡')

      const liked = await Like.create({ TweetId, UserId })
      return res.status(200).json({
        status: 'success',
        data: liked
      })
    } catch (error) {
      console.log(error.message)
      next(error)
    }
  },
  removeLike: async (req, res, next) => {
    const TweetId = req.params.id
    const UserId = helpers.getUser(req).id

    try {
      const [tweet, user] = await Promise.all([
        Tweet.findByPk(TweetId),
        User.findByPk(UserId)
      ])
      assert(tweet, '貼文不存在')
      assert(user, '使用者不存在')

      const like = await Like.findOne({ where: { TweetId, UserId } })
      assert(like, '不可不重複喜歡')
      const deletedLike = await like.destroy()
      return res.status(200).json({
        status: 'success',
        data: deletedLike
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = tweetController

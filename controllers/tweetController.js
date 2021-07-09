const { User, Tweet, Like, Reply, sequelize } = require('../models')
const Sequelize = require('sequelize')
const helpers = require('../_helpers')


const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      if (helpers.getUser(req).role !== 'user') return res.json({ status: 'error', message: '僅限使用者' })
      const tweets = await Tweet.findAll({
        raw: true,
        nest: true,
        attributes: [
          'id',
          'description',
          'createdAt',
          [Sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'totalReplies'],
          [Sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'totalLikes']
        ],
        include: [
          { model: User, attributes: ['avatar', 'name', 'account'] },
        ],
        order: [['createdAt', 'DESC']]
      })
      if (!tweets.length) return res.json({ status: 'error', message: '目前查無任何推文' })
      return res.json({ status: 'success', message: tweets })
    }
    catch (err) {
      next(err)
    }
  },

  getTweet: async (req, res, next) => {
    try {
      if (helpers.getUser(req).role !== 'user') return res.json({ status: 'error', message: '僅限使用者' })
      const tweet = await Tweet.findByPk(req.params.TweetId, {
        attributes: [
          'id',
          'description',
          'createdAt',
          [Sequelize.literal('(SELECT COUNT (*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'totalLikes'],
          [Sequelize.literal('(SELECT COUNT (*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'totalReplies'],
        ],
        include: [
          { model: User, attributes: ['avatar', 'name', 'account'] },
          { model: Reply, include: [{ model: User, attributes: ['avatar', 'name', 'account'] }] }
        ],
      })
      if (!tweet) return res.json({ status: 'error', message: '查無此推文' })

      return res.json({ status: 'success', message: tweet })
    }
    catch (err) {
      next(err)
    }
  },

  getTweetReplies: async (req, res, next) => {
    try {
      if (helpers.getUser(req).role !== 'user') return res.json({ status: 'error', message: '僅限使用者' })
      const replies = await Reply.findAll({
        raw: true,
        nest: true,
        where: { TweetId: req.params.TweetId },
        include: [{ model: User, attributes: ['avatar', 'name', 'account'] }],
        order: [['createdAt', 'DESC']]
      })
      return res.json({ status: 'success', message: replies })
    }
    catch (err) {
      next(err)
    }
  },

  postTweet: async (req, res, next) => {
    try {
      if (helpers.getUser(req).role !== 'user') return res.json({ status: 'error', message: '僅限使用者' })
      const { description } = req.body
      if (!description) return res.json({ status: 'error', message: '推文不得為空白' })
      if (description.length > 140) {
        return res.json({ status: 'error', message: '已超過推文最高上限140字' })
      }
      await Tweet.create({
        description: description.trim(),
        UserId: req.user.id
      })
      return res.json({ status: 'success', message: '推文新增成功' })
    }
    catch (err) {
      next(err)
    }
  },

  likeTweet: async (req, res, next) => {
    try {
      if (helpers.getUser(req).role !== 'user') return res.json({ status: 'error', message: '僅限使用者' })
      const { TweetId } = req.params
      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) return res.json({ status: 'error', message: '查無此推文' })
      const [like, created] = await Like.findOrCreate({
        where: {
          UserId: helpers.getUser(req).id,
          TweetId
        }
      })
      if (created) return res.json({ status: 'success', message: '成功按讚推文' })
      const tweet22 = await Tweet.findAll({})
      return res.json({ status: 'error', message: '推文已按過讚' })
    }
    catch (err) {
      next(err)
    }
  },

  unlikeTweet: async (req, res, next) => {
    try {
      if (helpers.getUser(req).role !== 'user') return res.json({ status: 'error', message: '僅限使用者' })
      const like = await Like.findOne({
        where: {
          UserId: helpers.getUser(req).id,
          TweetId: req.params.TweetId
        }
      })
      if (!like) return res.json({ status: 'error', message: '此推文並無按讚紀錄' })
      await like.destroy()
      return res.json({ status: 'success', message: '按讚紀錄已刪除' })
    }
    catch (err) {
      next(err)
    }
  },

  postReply: async (req, res, next) => {
    try {
      if (helpers.getUser(req).role !== 'user') return res.json({ status: 'error', message: '僅限使用者' })
      const { content } = req.body
      const { TweetId } = req.params
      if (!content) return res.json({ status: 'error', message: '回覆不得為空白' })
      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) return res.json({ status: 'error', message: '找不到此推文' })
      await Reply.create({
        content: content.trim(),
        UserId: req.user.id,
        TweetId
      })
      return res.json({ status: 'success', message: '回覆新增成功' })
    }
    catch (err) {
      next(err)
    }
  },




}

module.exports = tweetController
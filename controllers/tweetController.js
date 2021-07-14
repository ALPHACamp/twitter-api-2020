const { User, Tweet, Like, Reply } = require('../models')
const Sequelize = require('sequelize')
const helpers = require('../_helpers')


const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      if (helpers.getUser(req).role !== 'user') return res.json({ status: 'error', message: '此功能僅開放給一般使用者' })
      const tweets = await Tweet.findAll({
        raw: true,
        nest: true,
        attributes: [
          'id',
          'description',
          'createdAt',
          [Sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'totalReplies'],
          [Sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'totalLikes'],
          [Sequelize.literal(`(SELECT EXISTS (SELECT * FROM Likes WHERE Likes.TweetId = Tweet.id AND UserId = ${helpers.getUser(req).id}))`), 'isLiked']
        ],
        include: [
          { model: User, attributes: ['id', 'avatar', 'name', 'account'] }
        ],
        order: [['createdAt', 'DESC']]
      })
      if (!tweets.length) return res.json({ status: 'error', message: '目前查無任何推文' })
      return res.json(tweets)
    }
    catch (err) {
      next(err)
    }
  },

  getTweet: async (req, res, next) => {
    try {
      if (helpers.getUser(req).role !== 'user') return res.json({ status: 'error', message: '此功能僅開放給一般使用者' })
      const tweet = await Tweet.findByPk(req.params.TweetId, {
        attributes: [
          'id',
          'description',
          'createdAt',
          [Sequelize.literal('(SELECT COUNT (*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'totalLikes'],
          [Sequelize.literal('(SELECT COUNT (*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'totalReplies'],
          [Sequelize.literal(`(SELECT EXISTS (SELECT * FROM Likes WHERE Likes.TweetId = Tweet.id AND UserId = ${helpers.getUser(req).id}))`), 'isLiked']
        ],
        include: [
          { model: User, attributes: ['id', 'avatar', 'name', 'account'] },
          {
            model: Reply,
            attributes: [
              'id',
              'content',
              [Sequelize.literal(`(SELECT EXISTS (SELECT * FROM Likes WHERE Likes.ReplyId = Replies.id AND Likes.UserId = ${helpers.getUser(req).id}))`), 'isLiked'],
              [Sequelize.literal('(SELECT COUNT (*) FROM Likes WHERE Likes.ReplyId = Replies.id)'), 'totalLikes']],
            include: [{ model: User, attributes: ['id', 'avatar', 'name', 'account'] }]
          }
        ],
      })
      if (!tweet) return res.json({ status: 'error', message: '查無此推文' })
      return res.json(tweet)
    }
    catch (err) {
      next(err)
    }
  },

  getTweetReplies: async (req, res, next) => {
    try {
      if (helpers.getUser(req).role !== 'user') return res.json({ status: 'error', message: '此功能僅開放給一般使用者' })
      const replies = await Reply.findAll({
        raw: true,
        nest: true,
        where: { TweetId: req.params.TweetId },
        attributes: [
          'id',
          'content',
          [Sequelize.literal(`(SELECT EXISTS (SELECT * FROM Likes WHERE Likes.ReplyId = Reply.id AND Likes.UserId = ${helpers.getUser(req).id}))`), 'isLiked'],
          [Sequelize.literal(`(SELECT COUNT (*) FROM Likes WHERE Likes.ReplyId = Reply.id)`), 'totalLikes']
        ],
        include: [{ model: User, attributes: ['id', 'avatar', 'name', 'account'] }],
        order: [[Sequelize.literal('totalLikes'), 'DESC']]
      })
      return res.json(replies)
    }
    catch (err) {
      next(err)
    }
  },

  postTweet: async (req, res, next) => {
    try {
      if (helpers.getUser(req).role !== 'user') return res.json({ status: 'error', message: '此功能僅開放給一般使用者' })
      const { description } = req.body
      if (!description) return res.json({ status: 'error', message: '請填寫推文內容' })
      if (description.length > 140) {
        return res.json({ status: 'error', message: '已超過推文最高上限140字' })
      }
      const tweet = await Tweet.create({
        description: description.trim(),
        UserId: helpers.getUser(req).id
      })
      return res.json({ status: 'success', message: tweet })
    }
    catch (err) {
      next(err)
    }
  },

  likeTweet: async (req, res, next) => {
    try {
      if (helpers.getUser(req).role !== 'user') return res.json({ status: 'error', message: '此功能僅開放給一般使用者' })
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
      return res.json({ status: 'error', message: '推文已按過讚' })
    }
    catch (err) {
      next(err)
    }
  },

  unlikeTweet: async (req, res, next) => {
    try {
      if (helpers.getUser(req).role !== 'user') return res.json({ status: 'error', message: '此功能僅開放給一般使用者' })
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
      if (helpers.getUser(req).role !== 'user') return res.json({ status: 'error', message: '此功能僅開放給一般使用者' })
      const { content } = req.body
      const { TweetId } = req.params
      if (content.length > 140) return res.json({ status: 'error', message: '回覆字數不得超過140字' })
      if (!content) return res.json({ status: 'error', message: '請填寫回覆內容' })
      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) return res.json({ status: 'error', message: '找不到此推文' })
      await Reply.create({
        content: content.trim(),
        UserId: helpers.getUser(req).id,
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
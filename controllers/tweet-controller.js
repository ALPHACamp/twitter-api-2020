const { Tweet, Reply, Like, Sequelize, User } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  postTweet: async (req, res, next) => {
    const description = req.body?.description
    const UserId = helpers.getUser(req)?.id
    if (description.length > 140 || description.length < 1) return res.status(400).json({ status: 'error', message: 'Content should be less than 140 characters and not empty' })
    try {
      const tweet = await Tweet.create({
        description,
        UserId
      })
      return res.status(200).json({
        status: 'success',
        message: 'Successfully post the tweet',
        data: { tweet }
      })
    } catch (err) {
      next(err)
    }
  },
  getTweets: async (req, res, next) => {
    const ownerId = helpers.getUser(req)?.id
    try {
      const tweets = await Tweet.findAll({
        // 推文資料
        attributes: [
          'id',
          'description',
          'createdAt',
          'updatedAt',
          [Sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id )'), 'reply_count'],
          [Sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id )'), 'like_count'],
          [Sequelize.literal(`(SELECT COUNT(*) FROM Likes WHERE Likes.UserId = ${ownerId} AND Likes.TweetId = Tweet.id )`), 'is_liked']
        ],
        include: [
          { // 推文者
            model: User,
            attributes: ['id', 'name', 'account', 'avatar']
          },
          { // 留言
            model: Reply,
            attributes: { exclude: 'TweetId' },
            include: [
              { // 留言者
                model: User,
                attributes: ['id', 'name', 'account', 'avatar']
              }
            ],
            order: [['updatedAt', 'DESC']]
          }
        ],
        order: [['updatedAt', 'DESC']],
        nest: true
      })
      if (!tweets) return res.status(404).json({ status: 'error', message: 'Tweet does not exist' })
      return res.status(200).json(tweets)
    } catch (err) {
      next(err)
    }
  },
  getTweet: async (req, res, next) => {
    const ownerId = helpers.getUser(req)?.id
    const id = req.params?.tweet_id
    try {
      const tweet = await Tweet.findByPk(id, {
        attributes: [
          'id',
          'description',
          'createdAt',
          'updatedAt',
          [Sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id )'), 'reply_count'],
          [Sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id )'), 'like_count'],
          [Sequelize.literal(`(SELECT COUNT(*) FROM Likes WHERE Likes.UserId = ${ownerId} AND Likes.TweetId = Tweet.id )`), 'is_liked']
        ],
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'account', 'avatar']
          },
          {
            model: Reply,
            attributes: { exclude: 'TweetId' },
            include: [
              {
                model: User,
                attributes: ['id', 'name', 'account', 'avatar']
              }
            ],
            order: [['updatedAt', 'DESC']]
          }
        ],
        nest: true
      })
      if (!tweet) return res.status(404).json({ status: 'error', message: 'Tweet does not exist' })
      return res.status(200).json(tweet)
    } catch (err) {
      next(err)
    }
  },
  deleteTweet: async (req, res, next) => {
    const ownerId = helpers.getUser(req)?.id
    const TweetId = req.params?.tweet_id
    try {
      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) return res.status(404).json({ status: 'error', message: 'Tweet does not exist' })
      // 非推文者不得執行刪除操作
      if (tweet.UserId !== ownerId) return res.status(403).json({ status: 'error', message: 'Permission denied' })
      await tweet.destroy()
      return res.status(200).json({
        status: 'success',
        message: 'Successfully deleted the tweet',
        data: { tweet }
      })
    } catch (err) {
      next(err)
    }
  },
  getReplies: async (req, res, next) => {
    const TweetId = req.params?.tweet_id
    try {
      const replies = await Reply.findAll({
        // 留言內容
        where: { TweetId },
        attributes: ['id', 'comment', 'createdAt', 'updatedAt'],
        include: [{
          // 留言的推文
          model: Tweet,
          attributes: ['id', 'description', 'createdAt', 'updatedAt'],
          include: [{
            // 推文者
            model: User,
            attributes: ['id', 'name', 'account', 'avatar']
          }]
        }, {
          // 留言者
          model: User,
          attributes: ['id', 'name', 'account', 'avatar']
        }],
        order: [['updatedAt', 'DESC']],
        nest: true,
        raw: true
      })
      if (!replies) return res.status(404).json({ status: 'error', message: 'Reply does not exist' })
      return res.status(200).json(replies)
    } catch (err) {
      next(err)
    }
  },
  postReply: async (req, res, next) => {
    const ownerId = helpers.getUser(req)?.id
    const { comment } = req.body ?? {}
    if (comment.length < 1 || comment.length > 140) return res.status(400).json({ status: 'error', message: 'Comment should be less than 140 characters and not empty' })
    const UserId = ownerId
    const TweetId = req.params.tweet_id
    try {
      const reply = await Reply.create({
        UserId,
        TweetId,
        comment
      })
      return res.status(200).json(reply)
    } catch (err) {
      next(err)
    }
  }, // 喜歡功能
  addLike: async (req, res, next) => {
    const ownerId = helpers.getUser(req)?.id
    const TweetId = req.params?.id
    try {
      const [tweet, like] = await Promise.all([
        Tweet.findByPk(TweetId),
        Like.findOne({
          where: {
            UserId: ownerId,
            TweetId
          }
        })
      ])
      if (!tweet) { return res.status(400).json({ status: 'error', message: 'Tweet does not exist' }) }
      if (like) { return res.status(400).json({ status: 'error', message: 'You already liked this tweet' }) }
      await Like.create({
        UserId: ownerId,
        TweetId
      })
      return res.json({
        status: 'success',
        message: 'Successfully liked the tweet',
        data: { tweet }
      })
    } catch (err) {
      next(err)
    }
  }, // 移除喜歡功能
  removeLike: async (req, res, next) => {
    const ownerId = helpers.getUser(req)?.id
    const TweetId = req.params?.id
    try {
      const [tweet, like] = await Promise.all([
        Tweet.findByPk(TweetId),
        Like.findOne({
          where: {
            UserId: ownerId,
            TweetId
          }
        })
      ])
      if (!tweet) { return res.status(400).json({ status: 'error', message: 'Tweet does not exist' }) }
      if (!like) { return res.status(400).json({ status: 'error', message: "You haven't liked this tweet" }) }
      await like.destroy()
      return res.json({
        status: 'success',
        message: 'Successfully unliked the tweet',
        data: { tweet }
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController

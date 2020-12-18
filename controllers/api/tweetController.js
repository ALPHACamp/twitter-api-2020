const db = require('../../models')
const Tweet = db.Tweet
const User = db.User
const Like = db.Like
const Reply = db.Reply

const sequelize = require('sequelize')
const helpers = require('../../_helpers.js')


const tweetController = {

  replyTweet: async (req, res, next) => {
    try {
      const tweetId = req.params.id
      const tweet = await Tweet.findByPk(tweetId)
      if (!tweet) return res.status(400).json({ status: 'error', message: '無此篇貼文' })

      const comment = req.body.comment
      await Reply.create({
        UserId: helpers.getUser(req).id,
        TweetId: tweetId,
        comment: comment
      })
      return res.json({ status: "success", message: "" })
    } catch (error) {
      next(error)
    }
  },

  getReplies: async (req, res, next) => {
    try {
      const tweetId = req.params.id
      const tweet = await Tweet.findByPk(tweetId)
      if (!tweet) return res.status(400).json({ status: 'error', message: '無此篇貼文' })

      const replies = await Reply.findAll({
        raw: true,
        nest: true,
        where: { TweetId: tweetId },
        include: [{
          model: User,
          attributes: ['id', 'name', 'account', 'avatar']
        }],
        order: [
          [sequelize.literal('createdAt'), 'DESC'],
        ],
      })
      replies.map(reply => {
        reply.createdAt = reply.createdAt.getTime()
        return reply
      })

      return res.json(replies)
    } catch (error) {
      next(error)
    }
  },

  likeTweet: async (req, res, next) => {
    try {
      const tweetId = req.params.id
      const tweet = await Tweet.findByPk(tweetId)
      if (!tweet) return res.status(400).json({ status: 'error', message: '沒有該則貼文' })

      const isExisting = await Like.findOne({ where: { UserId: helpers.getUser(req).id, TweetId: tweetId } })
      if (!isExisting) {
        Like.create({
          UserId: helpers.getUser(req).id,
          TweetId: tweetId
        })
      }

      return res.json({ status: 'success', message: '' })
    } catch (error) {
      next(error)
    }
  },

  unlikeTweet: async (req, res, next) => {
    try {
      const tweetId = req.params.id
      const tweet = await Tweet.findByPk(tweetId)
      if (tweet) {
        await tweet.destroy()
      }
      return res.json({ status: 'success', message: '' })
    } catch (error) {
      next(error)
    }
  },

  getTweet: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id, {
        include: [{
          model: User,
          attributes: ['id', 'name', 'account', 'avatar']
        }],
        attributes: {
          include: [
            [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'repliesCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likesCount'],
          ],
          exclude: ['updatedAt']
        }
      })

      if (!tweet) return res.status(400).json({ status: 'error', message: '沒有這則貼文' })

      tweet.createdAt = tweet.createdAt.getTime()
      return res.json(tweet)
    } catch (error) {
      next(error)
    }
  },

  postTweet: async (req, res, next) => {
    const { description, createdTimestamp } = req.body
    try {
      await Tweet.create({
        UserId: helpers.getUser(req).id,
        description: description,
        // createdAt: Date(createdTimestamp) 1608215153858 frontend
      })
      return res.json({ status: "success", message: "" })
    } catch (error) {
      next(error)
    }
  },

  getTweets: async (req, res, next) => {
    try {
      const rawTweets = await Tweet.findAll({
        raw: true,
        nest: true,
        include: [{
          model: User,
          attributes: ['id', 'name', 'account', 'avatar']
        }],
        attributes: {
          include: [
            [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'repliesCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likesCount'],
          ],
          exclude: ['updatedAt']
        },
        order: [
          [sequelize.literal('createdAt'), 'DESC'],
        ]
      })
      const likedTweets = await Like.findAll({
        raw: true,
        nest: true,
        where: { UserId: helpers.getUser(req).id },
        attributes: ['TweetId']
      })
      const tweets = rawTweets.map(t => ({
        ...t,
        createdAt: t.createdAt.getTime(),
        isLiked: likedTweets.map(element => element.TweetId).includes(t.id)
      }))

      return res.json(tweets)
    } catch (error) {
      next(error)
    }
  },

}

module.exports = tweetController
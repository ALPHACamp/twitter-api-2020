const { Tweet, Like, User, Reply, sequelize } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const tweets = await Tweet.findAll({
        include: { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
        attributes: [
          'id', 'description', 'createdAt',
          [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'replyCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likeCount'],
          [sequelize.literal(`EXISTS(SELECT id FROM Likes WHERE Likes.UserId = ${currentUserId} AND Likes.TweetId = Tweet.id)`), 'isLiked']
        ],
        order: [['createdAt', 'DESC']],
        nest: true,
        raw: true
      })
      return res.json(tweets)
    } catch (err) {
      next(err)
    }
  },

  getTweet: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const tweetId = Number(req.params.id)
      const tweet = await Tweet.findOne({
        where: { id: tweetId },
        include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }],
        attributes: ['id', 'description', 'createdAt',
          [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'replyCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likeCount'],
          [sequelize.literal(`EXISTS(SELECT id FROM Likes WHERE Likes.UserId = ${currentUserId} AND Likes.TweetId = Tweet.id)`), 'isLiked']
        ],
        raw: true,
        nest: true
      })
      // error code 404
      if (!tweet) {
        return res.status(404).json({
          status: 'error',
          message: 'The tweet does not exist.'
        })
      }
      return res.status(200).json(tweet)
    } catch (err) {
      return next(err)
    }
  },

  getTweetReplies: async (req, res, next) => {
    try {
      const tweetId = Number(req.params.tweet_id)
      const [tweet, replies] = await Promise.all([
        Tweet.findByPk(tweetId),
        Reply.findAll({
          where: { TweetId: tweetId },
          attributes: ['id', 'comment', 'createdAt'],
          include: [
            { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
            { model: Tweet, attributes: ['id'], include: { model: User, attributes: ['id', 'account'] } }
          ],
          order: [['createdAt', 'DESC']],
          nest: true,
          raw: true
        })
      ])
      if (!tweet) {
        return res.status(404).json({
          status: 'error',
          message: 'The tweet does not exist.'
        })
      }
      res.status(200).json(replies)
    } catch (err) {
      next(err)
    }
  },

  addTweetLike: async (req, res, next) => {
    try {
      const TweetId = req.params.id
      const currentUserId = helpers.getUser(req).id
      const tweet = await Tweet.findByPk(TweetId, { raw: true })

      // status 404 tweet not exist
      if (!tweet) {
        res.status(404).json({
          status: 'error',
          message: 'The tweet does not exist.'
        })
      }
      const like = await Like.findOne({
        where: { TweetId, UserId: currentUserId }
      })

      // status 400 like liked tweets
      if (like) throw new Error('You already liked the tweet.')
      await Like.create({ TweetId, UserId: currentUserId })
      return res.status(200).json({ status: 'success' })
    } catch (err) {
      next(err)
    }
  },

  deleteTweetLike: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const TweetId = req.params.id
      const tweet = await Tweet.findByPk(TweetId, { raw: true })

      // status 404 tweets not found
      if (!tweet) {
        res.status(404).json({
          status: 'error',
          message: 'The tweet does not exist.'
        })
      }

      const like = await Like.findOne({
        where: { TweetId, UserId: currentUserId },
        raw: true
      })

      // status 400 have not liked the tweet
      if (!like) throw new Error('You have not liked the tweet.')

      // destroy like
      await Like.destroy({ where: { id: like.id } })

      // status 200 success
      res.status(200).json({ status: 'success' })
    } catch (err) {
      next(err)
    }
  },

  addTweet: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const description = req.body.description?.trim()

      // status 400 while description length > 140
      if (description.length > 140) throw new Error('Tweet description must be less than 140 characters long.')

      // status 400 wile description is empty
      if (!description) throw new Error('Tweet description is required.')

      await Tweet.create({
        UserId: currentUserId,
        description
      })
      // success 200
      return res.status(200).json({ status: 'success' })
    } catch (err) {
      next(err)
    }
  },

  deleteTweet: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const TweetId = Number(req.params.id)
      const tweet = await Tweet.findByPk(TweetId, { raw: true })

      // 404 find no tweet
      if (!tweet) {
        res.status(404).json({
          status: 'error',
          message: 'The tweet does not exist.'
        })
      }

      // 403 wanna delete others tweet
      if (tweet.UserId !== currentUserId) {
        res.status(403).json({
          status: 'error',
          message: 'User can only delete their own tweet.'
        })
      }

      // delete tweet
      // delete replies of tweet
      // delete likes of tweet
      await Promise.all([
        Tweet.destroy({ where: { id: TweetId } }),
        Reply.destroy({ where: { TweetId } }),
        Like.destroy({ where: { TweetId } })
      ])

      // status 200 success
      return res.status(200).json({ status: 'success' })
    } catch (err) {
      next(err)
    }
  },

  addTweetReply: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const comment = req.body.comment?.trim()
      const TweetId = req.params.tweet_id
      const tweet = await Tweet.findByPk(TweetId, { raw: true })

      // status 400 no comment
      if (!comment) throw new Error('Reply comment is required.')

      // status 400 comment too long
      if (comment.length > 140) throw new Error('Reply comment must be less than 140 characters long.')
      // status 404 tweet not exist.
      if (!tweet) {
        res.status(404).json({
          status: 'error',
          message: 'The tweet you want to reply does not exist.'
        })
      }

      // status 200 success comment
      await Reply.create({ comment, UserId: currentUserId, TweetId })
      return res.status(200).json({ status: 'success' })
    } catch (err) {
      next(err)
    }
  },

  deleteTweetReply: (req, res, next) => {
    res.send('delete')
  }
}

module.exports = tweetController

const { Tweet, Reply, Like, User, Sequelize } = require('../models')
const helpers = require('../_helpers')

const TweetService = {
  postTweet: async (UserId, description) => {
    await Tweet.create({
      UserId,
      description
    })
    return {
      status: 'success',
      message: 'tweet was successfully created'
    }
  },
  getTweets: async (currentUserId) => {
    return await Tweet.findAll({
      attributes: [
        ['id', 'TweetId'],
        'description',
        'createdAt',
        [Sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'LikesCount'],
        [Sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'RepliesCount'],
        [Sequelize.literal(`exists(SELECT 1 FROM Likes WHERE UserId = ${currentUserId} and TweetId = Tweet.id)`), 'isLike']

      ],
      include: [{ model: User, attributes: ['id', 'avatar', 'name', 'account'] }],
      order: [['createdAt', 'DESC']]
    })
  },
  getTweet: async (currentUserId, tweetId) => {
    return await Tweet.findByPk(tweetId, {
      attributes: [
        'id',
        'description',
        'createdAt',
        [Sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'RepliesCount'],
        [Sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'LikesCount'],
        [Sequelize.literal(`exists(SELECT 1 FROM Likes WHERE UserId = ${currentUserId} and TweetId = Tweet.id)`), 'isLike']

      ],
      include: [
        { model: User, attributes: ['id', 'name', 'avatar', 'account'] },
        { model: Reply, attributes: ['id', 'comment', 'createdAt'], include: { model: User, attributes: ['id', 'name', 'avatar', 'account'] } }
      ],
      order: [[Reply, 'createdAt', 'DESC']]
    })
  },
  postReply: async (req, res, callback) => {
    const { comment } = req.body
    const { tweet_id } = req.params

    try {
      const tweet = await Tweet.findByPk(tweet_id)

      if (!tweet) {
        return callback(400, { status: 'error', message: "tweet doesn't exist" })
      }

      if (!comment.trim().length) {
        return callback(400, { status: 'error', message: "reply content can't be blank" })
      }

      await Reply.create({
        TweetId: tweet_id,
        UserId: helpers.getUser(req).id,
        comment: comment.trim()
      })
      callback(200, { status: 'success', message: 'reply tweet successfully' })
    } catch (err) {
      console.log('postReply error', err)
      res.sendStatus(500)
    }
  },
  getReplies: async (req, res, callback) => {
    try {
      const replies = await Reply.findAll({
        where: { TweetId: req.params.tweet_id },
        order: [['createdAt', 'DESC']]
      })
      if (!replies.length) {
        return callback(400, { status: 'error', message: "reply doesn't exist" })
      }
      callback(200, replies)
    } catch (err) {
      console.log('getReplies error', err)
      res.sendStatus(500)
    }
  },
  addLike: async (req, res, callback) => {
    const { tweet_id } = req.params
    const userId = helpers.getUser(req).id

    try {
      const tweet = await Tweet.findByPk(tweet_id)
      if (!tweet) {
        return callback(400, { status: 'error', message: "tweet doesn't exist" })
      }

      const like = await Like.findOne({ where: { UserId: userId, TweetId: tweet_id } })

      if (like) {
        return callback(400, { status: 'error', message: 'you already liked this tweet' })
      }

      await Like.create({
        UserId: userId,
        TweetId: tweet_id
      })
      callback(200, { status: 'success', message: 'liked successfully' })
    } catch (err) {
      console.log('addLike error', err)
      res.sendStatus(500)
    }
  },
  removeLike: async (req, res, callback) => {
    const { tweet_id } = req.params
    const userId = helpers.getUser(req).id

    try {
      const tweet = await Tweet.findByPk(tweet_id)
      if (!tweet) {
        return callback(400, { status: 'error', message: "tweet doesn't exist" })
      }

      const like = await Like.findOne({ where: { UserId: userId, TweetId: tweet_id } })

      if (!like) {
        return callback(400, { status: 'error', message: 'you have not like this tweet' })
      }

      await like.destroy()

      callback(200, { status: 'success', message: 'unliked successfully' })
    } catch (err) {
      console.log('removeLike error', err)
      res.sendStatus(500)
    }
  }

}

module.exports = TweetService

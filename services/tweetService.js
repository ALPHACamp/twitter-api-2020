const { Tweet, Reply, Like, User, Sequelize } = require('../models')
const apiError = require('../libs/apiError')

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
  postReply: async (UserId, TweetId, comment) => {
    const tweet = await Tweet.findByPk(TweetId)

    if (!tweet) {
      throw apiError.badRequest(404, "Tweet doesn't exist")
    }

    await Reply.create({
      UserId,
      TweetId,
      comment
    })
    return { status: 'success', message: 'reply tweet successfully' }
  },
  getReplies: async (TweetId) => {
    const replies = await Reply.findAll({
      where: { TweetId },
      order: [['createdAt', 'DESC']]
    })
    if (!replies.length) {
      throw apiError.badRequest(404, "Reply doesn't exist")
    }

    return replies
  },
  addLike: async (UserId, TweetId) => {
    const tweet = await Tweet.findByPk(TweetId)

    if (!tweet) {
      throw apiError.badRequest(404, "Tweet doesn't exist")
    }

    const [_, isLike] = await Like.findOrCreate({
      where: { UserId, TweetId }
    })

    if (!isLike) {
      throw apiError.badRequest(403, 'You already liked this tweet')
    }

    return {
      status: 'success',
      message: 'Liked successfully'
    }
  },
  removeLike: async (UserId, TweetId) => {
    const tweet = await Tweet.findByPk(TweetId)

    if (!tweet) {
      throw apiError.badRequest(404, "Tweet doesn't exist")
    }

    const like = await Like.findOne({ where: { UserId, TweetId } })

    if (!like) {
      throw apiError.badRequest(403, 'You have not like this tweet')
    }

    await like.destroy()

    return {
      status: 'success',
      message: 'Unliked successfully'
    }
  }
}

module.exports = TweetService

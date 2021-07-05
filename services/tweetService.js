const { Tweet, Reply, Like, User } = require('../models')

const tweetService = {
  getTweets: async (whereQuery = {}) => {
    return await Tweet.findAll({
      where: whereQuery,
      include: [{ model: User, attributes: ['name', 'account', 'avatar'] }],
      order: [['createdAt', 'DESC']]
    })
  },

  postTweet: async (tweet) => {
    await Tweet.create(tweet)
    return { message: 'A tweet has created' }
  },

  getTweet: async (tweetId) => {
    return await Tweet.findByPk(tweetId)
  },

  getTweetAndReplies: async (tweetId) => {
    return await Tweet.findByPk(tweetId, {
      include: Reply
    })
  },

  postReply: async (reply) => {
    await Reply.create(reply)
    return { message: 'A reply has created' }
  },

  likeTweet: async (like) => {
    await Like.create(like)
    return { message: 'A like has created' }
  },

  unlikeTweet: async (unlike) => {
    await Like.destroy({ where: unlike })
    return { message: 'A like has deleted' }
  },

  getAllRepliesFromUser: async (UserId) => {
    return await Reply.findAll({
      where: { UserId },
      nest: true,
      raw: true
    })
  }
}

module.exports = tweetService

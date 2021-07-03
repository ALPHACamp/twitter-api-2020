const { Tweet, Reply, Like } = require('../models')

const tweetService = {
  getTweets: async () => {
    try {
      return await Tweet.findAll({ raw: true, nest: true })
    } catch (error) {
      throw new Error(error)
    }
  },

  getTweetAndReplies: async (tweet_id) => {
    try {
      return await Tweet.findByPk(tweet_id, {
        include: Reply
      })
    } catch (error) {
      throw new Error(error)
    }
  },

  postReply: async (reply) => {
    try {
      await Reply.create(reply)
      return { status: 201, message: 'A reply has created' }
    } catch (error) {
      throw new Error(error)
    }
  },

  likeTweet: async (like) => {
    try {
      await Like.create(like)
      return { status: 201, message: 'A like has created' }
    } catch (error) {
      throw new Error(error)
    }
  },

  unlikeTweet: async (unlike) => {
    try {
      await Like.destroy({ where: { id: unlike.id } })
      return { status: 200, message: 'A like has deleted' }
    } catch (error) {
      throw new Error(error)
    }
  },
}

module.exports = tweetService
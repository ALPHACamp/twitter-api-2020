const { Tweet, Reply, Like } = require('../models')

const tweetService = {
  getTweets: async () => {
    return await Tweet.findAll()
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
  }
}

module.exports = tweetService

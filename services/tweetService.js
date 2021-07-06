const { Tweet, Reply, Like, User, Sequelize } = require('../models')

const tweetService = {
  getTweets: async (whereQuery, admin) => {
    if (admin) {
      return await Tweet.findAll({
        where: whereQuery,
        attributes: { exclude: ['UserId'] },
        include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }],
        order: [['createdAt', 'DESC']]
      })
    }

    return await Tweet.findAll({
      where: whereQuery,
      attributes: [
        'id', 'description', 'createdAt',
        [Sequelize.literal('count(distinct Likes.id)'), 'LikesCount']
      ],
      group: 'id',
      include: [
        { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
        { model: Reply, attributes: [[Sequelize.literal('count(distinct Replies.id)'), 'RepliesCount']] },
        { model: Like, attributes: [] }
      ],
      order: [['createdAt', 'DESC']]
    })
  },

  postTweet: async (tweet) => {
    await Tweet.create(tweet)
    return { status: 'success', message: 'A tweet has created' }
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
    return { status: 'success', message: 'A reply has created' }
  },

  likeTweet: async (like) => {
    await Like.create(like)
    return { status: 'success', message: 'A like has created' }
  },

  unlikeTweet: async (unlike) => {
    await Like.destroy({ where: unlike })
    return { status: 'success', message: 'A like has deleted' }
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

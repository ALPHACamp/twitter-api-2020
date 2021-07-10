const { Tweet, Reply, Like, User, Sequelize } = require('../models')

const tweetService = {
  getTweets: async (currentUserId, whereQuery = {}) => {
    return await Tweet.findAll({
      where: whereQuery,
      attributes: [
        ['id', 'TweetId'], 'createdAt',
        [Sequelize.literal('substring(description,1,50)'), 'description'],
        [Sequelize.literal('count(distinct Likes.id)'), 'LikesCount'],
        [Sequelize.literal('count(distinct Replies.id)'), 'RepliesCount'],
        [Sequelize.literal(`exists(select 1 from Likes where UserId = ${currentUserId} and TweetId = Tweet.id)`), 'isLike']
      ],
      group: 'TweetId',
      include: [
        { model: Like, attributes: [] },
        { model: Reply, attributes: [] },
        {
          model: User,
          attributes: ['id', 'name', 'avatar', [Sequelize.fn('concat', '@', Sequelize.col('User.account')), 'account']]
        }
      ],
      order: [['createdAt', 'DESC']]
    })
  },

  getTweetsForAdmin: async (whereQuery = {}) => {
    return await Tweet.findAll({
      where: whereQuery,
      attributes: ['id', 'createdAt', [Sequelize.literal('substring(description,1,50)'), 'description']],
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'avatar', [Sequelize.fn('concat', '@', Sequelize.col('User.account')), 'account']]
        }
      ],
      order: [['createdAt', 'DESC']]
    })
  },

  postTweet: async (tweet) => {
    await Tweet.create(tweet)
    return { status: 'success', message: 'A tweet has created' }
  },

  getTweet: async (currentUserId, tweetId) => {
    return await Tweet.findByPk(tweetId, {
      attributes: [
        'id', 'description', 'createdAt',
        [Sequelize.literal('count(distinct Likes.id)'), 'LikesCount'],
        [Sequelize.literal(`exists(select 1 from Likes where UserId = ${currentUserId} and TweetId = Tweet.id)`), 'isLike']
      ],
      group: 'Replies.id',
      include: [
        { model: Like, attributes: [] },
        {
          model: User,
          attributes: ['id', 'name', 'avatar', [Sequelize.fn('concat', '@', Sequelize.col('User.account')), 'account']]
        },
        {
          model: Reply,
          attributes: ['id', 'comment', 'createdAt'],
          include: {
            model: User,
            attributes: ['id', 'name', 'avatar', [Sequelize.fn('concat', '@', Sequelize.col('Replies.User.account')), 'account']]
          }
        }
      ]
    })
  },

  getTweetAndReplies: async (tweetId) => {
    return await Tweet.findByPk(tweetId, { include: Reply })
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
      attributes: ['id', 'TweetId', 'comment', 'createdAt'],
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'avatar', [Sequelize.fn('concat', '@', Sequelize.col('User.account')), 'account']]
        },
        {
          model: Tweet,
          attributes: ['description'],
          include: { model: User, attributes: ['id', [Sequelize.fn('concat', '@', Sequelize.col('Tweet.User.account')), 'account']] }
        }
      ],
      order: [['createdAt', 'DESC']]
    })
  }
}

module.exports = tweetService

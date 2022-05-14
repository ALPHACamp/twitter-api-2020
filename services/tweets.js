const { Tweet, User, Like, Reply } = require('../models')
const sequelize = require('sequelize')

const tweets = {
  getAll: async () => {
    try {
      const rawTweets = await Tweet.findAll({
        attributes: {
          exclude: ['updatedAt']
        },
        include: [
          {
            model: User,
            attributes: [
              'name',
              'account',
              'avatar'
            ]
          },
          {
            model: Like,
            attributes: [
              [sequelize.fn('COUNT', sequelize.col('Likes.Tweet_id')), 'likeCounts']
            ]
          },
          {
            model: Reply,
            attributes: [
              [sequelize.fn('COUNT', sequelize.col('Replies.Tweet_id')), 'replyCounts']
            ]
          }
        ],
        order: [['created_at', 'DESC']],
        group: ['id'],
        nest: true,
        raw: true
      })
      const tweets = rawTweets.map(element => ({
        id: element.id,
        name: element.User.name,
        account: element.User.account,
        avatar: element.User.avatar,
        description: element.description,
        createdAt: element.createdAt,
        likeCount: element.Likes.likeCounts,
        replyCount: element.Replies.replyCounts
      }))
      return tweets
    } catch (err) {
      console.log(err)
    }
  },
  getOne: async (tweetId) => {
    try {
      const tweet = await Tweet.findByPk(tweetId, { raw: true })
      return tweet
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = tweets

const { Tweet, User, Reply, Like } = require('../models')
const sequelize = require('sequelize')
const tweetServices = {
  getTweets: async (req, cb) => {
    try {
      const tweets = await Tweet.findAll({
        include: [
          { model: Like, attributes: [] },
          { model: Reply, attributes: [] },
          { model: User, attributes: ['account', 'name', 'avatar'] }
        ],
        attributes: {
          include: [
            [
              sequelize.fn(
                'COUNT',
                sequelize.fn('DISTINCT', sequelize.col('Likes.id'))
              ),
              'likeCount'
            ],
            [
              sequelize.fn(
                'COUNT',
                sequelize.fn('DISTINCT', sequelize.col('Replies.id'))
              ),
              'replyCount'
            ]
          ]
        },
        group: ['Tweet.id'],
        order: [['createdAt', 'DESC']]
      })

      const result = tweets.map(tweet => ({
        ...tweet.toJSON(),
        isLiked: 'notyet'
      }))

      return cb(null, { tweets: result })
    } catch (err) {
      cb(err)
    }

  }
}
module.exports = tweetServices
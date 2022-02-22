const { Tweet, User, Reply, Like } = require('../models')
const sequelize = require('sequelize')
const helper = require('../_helpers')
const tweetServices = {
  getTweets: async (req, cb) => {
    try {
      // 找出所有tweet 包含喜歡數及回覆數和user資訊
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
      // 找出目前使用者喜歡的推文
      const likedTweets = await Like.findAll({
        where: { userId: helper.getUser(req).id },
        attributes: ['tweetId'],
        raw: true
      })
      const likedData = likedTweets.map(data =>
        data.tweetId
      )
      const result = tweets.map(tweet => ({
        ...tweet.toJSON(),
        isLiked: likedData.includes(tweet.id)
      }))
      return cb(null, result)
    } catch (err) {
      cb(err)
    }

  }
}
module.exports = tweetServices
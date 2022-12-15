const { User, Reply, Tweet, Like, sequelize } = require('../models')
const { Op } = sequelize
const { getOffset } = require('../_helpers')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const DEFAULT_LIMIT = 10
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)

      let tweets = await Tweet.findAll({
        attributes: [
          ['id', 'TweetId'], 'createdAt', 'description',
          [sequelize.literal('count(distinct Likes.id)'), 'LikesCount'],
          [sequelize.literal('count(distinct Replies.id)'), 'RepliesCount']
        ],
        group: 'TweetId',
        include: [
          { model: Like, attributes: [] },
          { model: Reply, attributes: [] },
          { model: User, attributes: ['id', 'name', 'avatar', 'account'], where: { role: { [Op.not]: 'admin' } } }
        ],
        order: [['createAt', 'DESC']],
        limit,
        offset,
        raw: true,
        nest: true
      })
      tweets = tweets.map(tweet => ({
        ...tweet,
        isLiked: req.user.LikedTweets ? req.user.LikedTweets.map(like => like.id).includes(tweet.TweetId) : null
      }))
      return res.status(200).json(tweets)
    } catch (err) {
      next(err)
    }
  }
}
module.exports = tweetController

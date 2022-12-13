const { User, Tweet, sequelize } = require('../models')
const helpers = require('../_helpers')
const dayjs = require('dayjs')
const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const loginUser = helpers.getUser(req)
      const tweets = await Tweet.findAll({
        include: { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
        attributes: [
          'id', 'description', 'createdAt',
          [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'replyCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likeCount']
        ],
        order: [['createdAt', 'DESC']],
        nest: true
      })
      const data = tweets.map(tweet => ({
        ...tweet.toJSON(),
        isLiked: loginUser?.Likes?.some(loginUserLike => loginUserLike?.TweetId === tweet.id),
        createdAt: dayjs(tweet.createdAt).valueOf()
      }))
      return res.status(200).json(data)
    } catch (err) { next(err) }
  }
}

module.exports = tweetController

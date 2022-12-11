const { Tweet, User, sequelize, Like } = require('../models')
const { getUser } = require('../_helpers')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        include: [{ model: User, attributes: ['id', 'account', 'name', 'avatar'] }],
        attributes: {
          include: [
            [sequelize.literal(`(SELECT COUNT(*) AS replyCounts FROM replies
          WHERE Tweet_id = tweet.id)`), 'replyCounts'],
            [sequelize.literal('(SELECT COUNT(*) AS likeCounts FROM likes WHERE Tweet_id = tweet.id)'), 'likeCounts']
          ]
        },
        order: [['createdAt', 'DESC']],
        raw: true
      })
      const loginUser = getUser(req)?.id
      const likes = await Like.findAll({
        where: { UserId: loginUser },
        raw: true
      })
      const data = tweets.map(tweet =>
        ({
          ...tweet,
          isLiked: likes.some(like => like.TweetId === tweet.id)
        })
      )
      res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  }
}
module.exports = tweetController

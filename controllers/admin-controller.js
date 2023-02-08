const { User, Tweet, sequelize } = require('../models')
const adminController = {
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        attributes: {
          exclude: ['email', 'password', 'introduction', 'role', 'createdAt', 'updatedAt'],
          include: [
            [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id)'), 'tweetCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)'), 'followerCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followerId = User.id)'), 'followingCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Tweets JOIN Likes ON Tweets.id = Likes.TweetId WHERE Tweets.UserId = User.id)'), 'likeCount']
          ]
        },
        order: [[sequelize.literal('tweetCount'), 'DESC']],
        raw: true
      })
      return res.status(200).json(users)
    } catch (err) {
      next(err)
    }
  },

  deleteTweet: async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      // delete tweet and it's replies and likes
      const result = await Tweet.destroy({ where: { id } })
      // if result = 0, return 404 for not found tweet
      if (!result) {
        return res.status(404).json({
          status: 'error',
          message: 'The tweet you want to delete does not exist.'
        })
      }
      // if result = 1, return status 200 for success
      return res.status(200).json({ status: 'success' })
    } catch (err) { next(err) }
  }
}

module.exports = adminController

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
      res.status(200).json(users)
    } catch (err) {
      next(err)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        include: {
          model: User, attributes: ['name', 'account', 'avatar']
        },
        order: [['createdAt', 'DESC']],
        nest: true,
        raw: true
      })
      const data = []
      tweets.forEach(tweet => {
        data.push({
          tweetId: tweet.id,
          userId: tweet.UserId,
          name: tweet.User.name,
          account: tweet.User.account,
          avatar: tweet.User.avatar,
          createdAt: tweet.createdAt,
          description: tweet.description
        })
      })
      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController

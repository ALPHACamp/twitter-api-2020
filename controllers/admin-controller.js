const { User, Tweet, sequelize } = require('../models')
const { dateFormat } = require('../helpers/date-helper')

const adminController = {
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        attributes: {
          exclude: ['password', 'role', 'createdAt', 'updatedAt'],
          include: [
            [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id )'), 'tweetCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.UserId = User.id )'), 'likeCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id )'), 'followerCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followerId = User.id )'), 'followingCount']
          ]
        },
        order: [[sequelize.literal('tweetCount'), 'DESC']],
        raw: true
      })
      res.status(200).json(users)
    } catch (error) {
      next(error)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        attributes: { exclude: ['updatedAt'] },
        include: [
          {
            model: User,
            attributes: {
              exclude: ['password', 'role', 'createdAt', 'updatedAt']
            }
          }],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })
      const tweetsData = tweets.map(tweet => ({
        ...tweet,
        description: tweet.description.substring(0, 50),
        relativeTime: dateFormat(tweet.createdAt).fromNow()
      }))
      res.status(200).json(tweetsData)
    } catch (error) {
      next(error)
    }
  },
  deleteTweet: async (req, res, next) => {
    try {
      const paramsId = Number(req.params.id)
      const tweet = await Tweet.findByPk(paramsId)
      if (!tweet) {
        const err = new Error('推文不存在!')
        err.status = 404
        throw err
      }
      const deletedTweet = await tweet.destroy()
      const deletedTweetData = deletedTweet.toJSON()
      res.status(200).json(deletedTweetData)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = adminController

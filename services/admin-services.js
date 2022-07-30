const { User, Tweet, Like, Followship } = require('../models')
const { Op } = require('sequelize')

const adminServices = {
  getUsers: async (req, cb) => {
    try {
      const users = await User.findAll({
        attributes: ['id', 'cover', 'avatar', 'account', 'name'],
        raw: true
      })
      const results = await Promise.all(users.map(async user => {
        const userTweets = await Tweet.findAll({ where: { UserId: user.id }, raw: true })
        const TweetCount = await Tweet.count({ where: { UserId: user.id } })
        const likeCount = await Like.count({
          where: {
            [Op.or]: userTweets.map(tweet => ({ TweetId: tweet.id }))
          }
        })
        const followerCount = await Followship.count({ where: { followingId: user.id } })
        const followingCount = await Followship.count({ where: { followerId: user.id } })
        return ({
          ...user,
          TweetCount,
          likeCount,
          followerCount,
          followingCount
        })
      }))
      results.sort((a, b) => b.TweetCount - a.TweetCount)
      return cb(null, results)
    } catch (err) {
      return cb(err)
    }
  }
}

module.exports = adminServices

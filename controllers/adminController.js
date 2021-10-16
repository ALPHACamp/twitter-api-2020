const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Followship = db.Followship
const Like = db.Like
const Sequelize = db.Sequelize
const sequelize = require('sequelize')


const adminController = {
  getTweets: async (req, res) => {
    try {
      const allTweets = await Tweet.findAll({
        order: [[Sequelize.literal('createdAt'), "DESC"]],
        include: [{ model: User, as: 'user', attributes: ['name', 'account', 'avatar', 'createdAt'] }]
      })
      return res.json({ allTweets })
    }
    catch (error) {
      console.log(error)
    }
  },

  getUsers: async (req, res) => {
    try {
      const allUsers = await User.findAll({
        where: { role: 'user' },
        attributes: [
          'id', 'name', 'account', 'avatar', 'cover',
          [sequelize.literal('(SELECT COUNT(*) FROM `tweets` WHERE tweets.UserId = User.id)'), 'tweetsCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM `likes` WHERE likes.UserId = User.id)'), 'likesCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM `followships` WHERE followships.followerId = User.id)'), 'followingsCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM `followships` WHERE followships.followingId = User.id)'), 'followersCount'],
        ],
        order: [
          [sequelize.literal('tweetsCount'), 'DESC'],
          ['id', 'ASC']
        ],
      })

      return res.json(allUsers)
    } catch (error) {
      console.log(error)
    }
  },

  deleteTweet: async (req, res) => {
    try {
      const TweetId = req.params.id
      await Promise.all([
        Tweet.destroy({ where: { id: TweetId } }),
        Like.destroy({ where: { TweetId } }),
        Reply.destroy({ where: { TweetId } })
      ])
      return res.status(200).json('Accept')
    }
    catch (error) {
      console.log(error)
    }
  }
}

module.exports = adminController
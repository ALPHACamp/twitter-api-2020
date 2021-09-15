const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Followship = db.Followship
const Like = db.Like
const Sequelize = db.Sequelize


const adminController = {
  getTweets: async (req, res) => {
    try {
      const allTweets = await Tweet.findAll({
        order: [[Sequelize.literal('createdAt'), "DESC"]],
        include: [{ model: User, as: 'user' }]
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
        include: [
          { model: Reply, as: 'replies' },
          { model: Followship, as: 'followings' },
          { model: Followship, as: 'followers' },
          { model: Like, as: 'likes' }
        ]
      })

      return res.json({ allUsers })
    }
    catch (error) {
      console.log(error)
    }
  },

  deleteTweet: async (req, res) => {
    try {
      const tweetId = req.params.id
      const tweet = await Tweet.findByPk(tweetId)
      await tweet.destroy()
      return res.status(200)
    }
    catch (error) {
      console.log(error)
    }
  }
}

module.exports = adminController
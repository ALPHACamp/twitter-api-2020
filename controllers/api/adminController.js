const db = require('../../models')
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
        attributes: ['name', 'account', 'avatar', 'cover'],
        include: [
          { model: Reply, as: 'replies', attributes: ['id'] },
          { model: Followship, as: 'followings', attributes: ['id'] },
          { model: Followship, as: 'followers', attributes: ['id'] },
          { model: Like, as: 'likes', attributes: ['id'] }
        ]
      })

      return res.json(allUsers)
    }
    catch (error) {
      console.log(error)
    }
  },

  deleteTweet: async (req, res) => {
    try {
      const tweetId = req.params.id
      const tweet = await Tweet.findByPk(tweetId)
      // if (tweet) {
      await tweet.destroy()
      return res.status(200).json('Accept')
      // } else {
      //   return res.status(200)
      // }
    }
    catch (error) {
      console.log(error)
    }
  }
}

module.exports = adminController
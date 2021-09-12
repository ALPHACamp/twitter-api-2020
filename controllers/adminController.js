const db = require('../models')
const User = db.User
const Tweet = db.Tweet
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
  }
}

module.exports = adminController
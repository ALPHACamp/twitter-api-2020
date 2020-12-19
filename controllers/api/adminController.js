const db = require('../../models')
const User = db.User
const Like = db.Like
const Tweet = db.Tweet

const adminController = {
  getUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
          { model: Tweet, include: [Like] }
        ]
      })
      return res.json({ users })
    } catch (error) {
      console.log(error)
    }
  },
  getTweets: async (req, res) => {
    try {
      const tweets = await Tweet.findAll({ include: [User] })
      return res.json({ tweets })
    } catch (error) {
      console.log(error)
    }
  },
  removeTweet: async (req, res) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id)
      if (!tweet) {
        return res.json({ status: 'error', message: "This post doesn't exist." })
      }
      await tweet.destroy()
      return res.json({ status: 'success', message: 'This post was successfully removed' })
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = adminController

const db = require('../../models')

const { User, Tweet } = db

// @todo - add error handling

const adminController = {
  getUsers: async (req, res) => {
    const users = await User.findAll()
    return res.json(users)
  },
  removeTweet: async (req, res) => {
    const tweet = await Tweet.findByPk(req.params.id)
    if (!tweet) {
      return res.status(400).json({ status: 'error', message: 'tweet id not exist' })
    }
    await tweet.destroy()
    return res.json({ status: 'success', message: 'Success' })
  }
}

module.exports = adminController

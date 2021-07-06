const { User, Tweet, Reply } = require('../models')
const helpers = require('../_helpers')

const adminController = {
  getAllUser: async (req, res, next) => {
    try {
      const user = await User.findAll()
      return res.json(user)
    } catch (err) { next(err) }
  },
  deleteTweet: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id) || false
      if (tweet) {
        tweet.destroy()
        return res.json({ status: 'success', message: "推文刪除成功" })
      }
    } catch (err) { next(err) }
  }

}

module.exports = adminController
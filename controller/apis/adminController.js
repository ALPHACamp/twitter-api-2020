const db = require('../../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const helper = require('../../_helpers')
const adminController = {
  getUsers: async (req, res) => {
    try {
      const users = await User.findAll({ raw: true, nest: true })
      return res.status(200).json(users)
    } catch (err) {
      console.log(err)
    }
  },
  deleteTweet: async (req, res) => {
    try {
      const tweet = await Tweet.destroy({ where: { id: req.params.id } })
      return res.status(200).json({ message: '刪除成功' })
    } catch (err) {
      console.log(err)
      return res.status(401).json(err)
    }
  }
}

module.exports = adminController

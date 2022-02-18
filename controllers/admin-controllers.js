const adminServices = require('../services/admin-service')

const adminController = {
  getUsers: async (req, res, next) => {
    try {
      const users = await adminServices.getUsers()

      return res.status(200).json(users)
    } catch (err) {
      next(err)
    }
  },
  deleteTweet: async (req, res, next) => {
    const tweetId = req.params.id
    try {
      const data = await adminServices.deleteTweet(tweetId)

      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
const adminService = require('../services/adminService')

const adminController = {
  deleteTweet: async (req, res, next) => {
    try {
      const data = await adminService.deleteTweet(req.params.tweet_id)
      return res.json(data)
    } catch (error) {
      next(error)
    }
  },

  getUsers: async (req, res, next) => {
    try {
      const data = await adminService.getUsers()
      return res.json(data)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = adminController

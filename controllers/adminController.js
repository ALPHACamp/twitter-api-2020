const adminService = require('../services/adminService')

const adminController = {
  signIn: async (req, res, next) => {
    const { email, password } = req.body
    try {
      const data = await adminService.signIn(email, password)
      return res.json(data)
    } catch (error) {
      next(error)
    }
  },

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

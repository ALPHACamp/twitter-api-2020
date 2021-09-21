
const adminService = require('../services/adminService')

const adminController = {
  adminSignIn: async (req, res, next) => {
    try {
      const { email, password } = req.body
      // Check required data
      if (!email || !password) {
        return res.json({
          status: 'error',
          message: 'Please enter both account and password',
        })
      }
      const { status, message, token, user } = await adminService.adminSignIn(email, password)
      return res.json({
        status,
        message,
        token,
        user,
      })
    } catch (err) {
      next(err)
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const users = await adminService.getUsers()
      return res.status(200).json(users)
    } catch (err) {
      next(err)
    }
  },
  getTweets: async (req, res) => {
    try {
      const tweets = await adminService.getTweets()
      return res.status(200).json(tweets)
    } catch (error) {
      next(err)
    }
  },
  deleteTweet: async (req, res) => {
    try {
      const id = Number(req.params.id)
      const { status, message } = await adminService.deleteTweet(id)
      return res.status(200).json({ status, message })
    } catch (error) {
      next(err)
    }
  }
}

module.exports = adminController

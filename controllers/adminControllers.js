const adminService = require('../services/adminService')

const adminController = {
  adminSignIn: async (req, res) => {
    try {
      const { account, password } = req.body
      // Check required data
      if (!account || !password) {
        return res.json({
          status: 'error',
          message: 'Please enter both account and password',
        })
      }
      const { status, message, token, user } = await adminService.adminSignIn(account, password)
      return res.json({
        status,
        message,
        token,
        user,
      })
    } catch (error) {
      console.log('Admin signIn error', error)
      res.sendStatus(500)
    }
  },
  getUsers: async (req, res) => {
    try {
      const users = await adminService.getUsers()
      return res.status(200).json(users)
    } catch (error) {
      console.log('Admin getUsers error', error)
    }
  },
  getTweets: async (req, res) => {
    try {
      const tweets = await adminService.getTweets()
      return res.status(200).json(tweets)
    } catch (error) {
      console.log('Admin getTweets error', error)
    }
  }
}

module.exports = adminController

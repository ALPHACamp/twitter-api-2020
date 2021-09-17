const adminService = require('../services/adminService')
const ApiError = require('../utils/customError')

const adminController = {
  getUsers: async (req, res, next) => {
    try {
      const users = await adminService.getUsers()

      // Check whether users exists
      if (!users.length) {
        throw new ApiError('AdminGetUsersError', 401, 'No users found')
      }

      return res.status(200).json(users)
    } catch (error) {
      next(error)
    }
  },

  getTweets: async (req, res, next) => {
    try {
      const tweets = await adminService.getTweets()

      // Check whether tweets exists
      if (!tweets.length) {
        throw new ApiError('AdminGetTweetsError', 401, 'No tweets found')
      }

      return res.status(200).json(tweets)
    } catch (error) {
      next(error)
    }
  },

  deleteTweet: async (req, res, next) => {
    try {
      const data = await adminService.deleteTweet(req.params.id)

      return res.status(200).json(data)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = adminController

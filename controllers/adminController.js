const adminService = require('../services/adminService')
const ApiError = require('../utils/customError')

const adminController = {
  getUsers: async (req, res, next) => {
    try {
      const users = await adminService.getUsers()

      // Check whether users exists
      if (!users) {
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

  deleteTweet: async (req, res) => {
    const data = await adminService.deleteTweet(req.params.id)

    // Check data status
    if (data['status'] === 'error') {
      return res.status(401).json(data)
    }

    return res.status(200).json(data)
  }
}

module.exports = adminController

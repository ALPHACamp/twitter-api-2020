const helpers = require('../_helpers')
const userServices = require('../services/user-service')

const userController = {
  login: async (req, res, next) => {
    const { account, password } = req.body

    try {
      const { status, data } = await userServices.login(account, password)

      return res.json({ status, data })
    } catch (error) {
      next(error)
    }
  },

  // User sign up for new account
  register: async (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    try {
      const { status, message } = await userServices.register(
        account,
        name,
        email,
        password,
        checkPassword
      )

      return res.json({ status, message })
    } catch (error) {
      next(error)
    }
  },

  // Get basic user info
  getUser: async (req, res, next) => {
    try {
      const user = await userServices.getUser(req)

      return res.json(user)
    } catch (error) {
      next(error)
    }
  },

  // Edit user profile
  putUser: async (req, res, next) => {
    const id = req.params.id
    const { files } = req
    const { email, password, name, account, introduction } = req.body
    try {
      const { status, message, userProfile } = await userServices.putUser(
        id,
        files,
        email,
        password,
        name,
        account,
        introduction
      )

      return res.status(200).json({
        status,
        message,
        userProfile
      })
    } catch (error) {
      next(error)
    }
  },

  // Get top 10 users
  getTopUsers: async (req, res, next) => {
    try {
      const topUsers = await userServices.getTopUsers(req)

      return res.status(200).json(topUsers)
    } catch (error) {
      next(error)
    }
  },

  // Get all tweets from specific user
  getUserTweets: async (req, res, next) => {
    const user = helpers.getUser(req)
    try {
      const tweets = await userServices.getUserTweets(req, user)

      return res.status(200).json(tweets)
    } catch (error) {
      next(error)
    }
  },

  // Get all replied tweets by specific user
  getUserRepliedTweet: async (req, res, next) => {
    try {
      const replies = await userServices.getUserRepliedTweet(req)

      return res.status(200).json(replies)
    } catch (error) {
      next(error)
    }
  },

  getUserLikes: async (req, res, next) => {
    try {
      const likes = await userServices.getUserLikes(req)

      return res.status(200).json(likes)
    } catch (error) {
      next(error)
    }
  },

  // Just for test, data included in GET api/users/:id
  getUserFollowings: async (req, res, next) => {
    try {
      const followings = await userServices.getUserFollowings(req)

      return res.status(200).json(followings)
    } catch (error) {
      next(error)
    }
  },

  // Just for test, data included in GET api/users/:id
  getUserFollowers: async (req, res, next) => {
    try {
      const followers = await userServices.getUserFollowers(req)

      return res.status(200).json(followers)
    } catch (error) {
      next(error)
    }
  },

  // Get current user info
  getCurrentUser: async (req, res, next) => {
    try {
      const user = await userServices.getCurrentUser(req)

      return res.status(200).json(user)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = userController

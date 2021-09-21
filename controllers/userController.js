const db = require('../models')
const helpers = require('../_helpers')
const User = db.User
const userService = require('../services/userService')

const userController = {
  signUp: async (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    try {
      const { status, message } = await userService.signUp(account, name, email, password)
      return res.json({ status, message })
    } catch (error) {
      next(error)
    }
  },
  signIn: async (req, res, next) => {
    try {
      const { account, password } = req.body

      const { status, message, token, user } = await userService.signIn(account, password)
      return res.json({
        status,
        message,
        token,
        user,
      })
    } catch (error) {
      next(error)
    }
  },
  getUser: async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      const currentUserId = helpers.getUser(req).id
      const user = await userService.getUser(id, currentUserId)

      if (id === currentUserId) {
        user.isCurrent = true
        return res.status(200).json(user)
      }
      user.isCurrent = false
      return res.status(200).json(user)
    } catch (error) {
      next(error)
    }
  },
  getCurrentUser: async (req, res, next) => {
    try {
      const currentUser = await userService.getCurrentUser(helpers.getUser(req).id)

      return res.status(200).json(currentUser)
    } catch (error) {
      next(error)
    }
  },
  putUser: async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      const { files } = req

      if (helpers.getUser(req).id !== id) {
        return res.status(403).json({
          status: 'error',
          message: 'Cannot edit others user profile',
        })
      }

      const { status, message } = await userService.putUser(id, files, req.body)
      return res.status(200).json({
        status,
        message,
      })
    } catch (error) {
      next(error)
    }
  },
  getUserTweets: async (req, res, next) => {
    const id = Number(req.params.id)
    const currentUserId = helpers.getUser(req).id
    try {
      const tweets = await userService.getUserTweets(id, currentUserId)
      return res.status(200).json(tweets)
    } catch (error) {
      next(error)
    }
  },
  getUserRepliedTweets: async (req, res, next) => {
    const id = Number(req.params.id)
    const currentUserId = helpers.getUser(req).id

    try {
      const replies = await userService.getUserRepliedTweets(id, currentUserId)
      return res.status(200).json(replies)
    } catch (error) {
      next(error)
    }
  },
  getUserLikedTweets: async (req, res, next) => {
    const id = Number(req.params.id)
    const currentUserId = helpers.getUser(req).id

    try {
      const tweets = await userService.getUserLikedTweets(id, currentUserId)
      return res.status(200).json(tweets)
    } catch (error) {
      next(error)
    }
  },
  getFollowings: async (req, res, next) => {
    const id = Number(req.params.id)
    const currentUserId = helpers.getUser(req).id
    try {
      const followings = await userService.getFollowings(id, currentUserId)
      if (!followings) {
        return res.status(400).json({ status: 'error', messages: 'No followings yet' })
      }
      return res.status(200).json(followings)
    } catch (error) {
      next(error)
    }
  },
  getFollowers: async (req, res, next) => {
    const id = Number(req.params.id)
    const currentUserId = helpers.getUser(req).id
    try {
      const followers = await userService.getFollowers(id, currentUserId)
      if (!followers) {
        return res.status(400).json({ status: 'error', messages: 'No followers yet' })
      }
      return res.status(200).json(followers)
    } catch (error) {
      next(error)
    }
  },
  getTopUsers: async (req, res, next) => {
    const currentUserId = helpers.getUser(req).id
    try {
      const topUsers = await userService.getTopUsers(currentUserId)
      return res.status(200).json(topUsers)
    } catch (error) {
      next(error)
    }
  },
  putUserSettings: async (req, res, next) => {
    const id = Number(req.params.id)
    const currentUserId = helpers.getUser(req).id
    try {
      if (id !== currentUserId) {
        return res.status(403).json({
          status: 'error',
          message: 'Cannot edit others user settings',
        })
      }
      const { status, message } = await userService.putUserSettings(id, req.body)
      return res.status(200).json({ status, message })
    } catch (error) {
      next(error)
    }
  },
}

module.exports = userController

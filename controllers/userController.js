const userService = require('../services/userService')

const userController = {
  signUp: (req, res) => {
    userService.signUp(req, res, (data) => res.status(data.status).json(data))
  },
  login: (req, res) => {
    userService.login(req, res, (data) => res.status(data.status).json(data))
  },
  getUser: (req, res) => {
    userService.getUser(req, res, data => res.status(data.status).json(data))
  },
  getUserTweets: (req, res) => {
    userService.getUserTweets(req, res, data => res.status(200).json(data))
  },
  putUser: (req, res) => {
    userService.putUser(req, res, data => res.status(data.status).json(data))
  },
  getUserFollowings: (req, res) => {
    userService.getUserFollowings(req, res, data => res.status(200).json(data))
  },
  getUserFollowers: (req, res) => {
    userService.getUserFollowers(req, res, data => res.status(200).json(data))
  },
  getUserLikedTweets: (req, res) => {
    userService.getUserLikedTweets(req, res, data => res.status(200).json(data))
  },
  getUserReplies: (req, res) => {
    userService.getUserReplies(req, res, data => {
      if (data.status) return res.status(data.status).json(data)
      res.status(200).json(data)
    })
  },
  getTopUser: (req, res) => {
    userService.getTopUser(req, res, data => {
      if (data.status) return res.status(data.status).json(data)
      res.status(200).json(data)
    })
  },
  getCurrentUser: (req, res) => {
    userService.getCurrentUser(req, res, data => {
      if (data.status) return res.status(data.status).json(data)
      res.status(200).json(data)
    })
  },
  getChatList: (req, res) => {
    userService.getChatList(req, res, data => {
      if (data.status) return res.status(data.status).json(data)
      return res.json(data)
    })
  }
}

module.exports = userController
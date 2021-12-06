// 載入所需套件
const userService = require('../services/userService')

const userController = {
  signUp: (req, res) => {
    userService.signUp(req, res, data => {
      return res.json(data)
    })
  },

  signIn: async (req, res) => {
    try {
      await userService.signIn(req, res, data => {
        return res.json(data)
      })
    } catch (err) {
      return res.status(401).json({ status: err.name, message: err.message })
    }
  },

  putUserSetting: (req, res) => {
    userService.putUserSetting(req, res, data => {
      return res.json(data)
    })
  },

  putUser: (req, res) => {
    userService.putUser(req, res, data => {
      return res.json(data)
    })
  },

  getCurrentUser: (req, res) => {
    userService.getCurrentUser(req, res, data => {
      return res.json(data)
    })
  },

  getUser: (req, res) => {
    userService.getUser(req, res, data => {
      return res.json(data)
    })
  },

  getUserTweets: (req, res) => {
    userService.getUserTweets(req, res, data => {
      return res.json(data)
    })
  },

  getUserReplies: (req, res) => {
    userService.getUserReplies(req, res, data => {
      return res.json(data)
    })
  },

  getUserLikes: (req, res) => {
    userService.getUserLikes(req, res, data => {
      return res.json(data)
    })
  },

  getUserFollowings: (req, res) => {
    userService.getUserFollowings(req, res, data => {
      return res.json(data)
    })
  },

  getUserFollowers: (req, res) => {
    userService.getUserFollowers(req, res, data => {
      return res.json(data)
    })
  },

  getUserTop: (req, res) => {
    userService.getUserTop(req, req, data => {
      return res.json(data)
    })
  }
}

// userService exports
module.exports = userController
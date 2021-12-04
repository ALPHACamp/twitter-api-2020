const userService = require('../../services/userService')

const userController = {
  signIn: (req, res) => {
    userService.signIn(req, res, data => {
      return res.json(data)
    })
  },

  signUp: (req, res) => {
    userService.signUp(req, res, data => {
      return res.json(data)
    })
  },

  getUsers: (req, res) => {
    userService.getUsers(req, res, data => {
      return res.json(data)
    })
  },

  getUser: (req, res) => {
    userService.getUser(req, res, data => {
      return res.json(data)
    })
  },

  putUser: (req, res) => {
    userService.putUser(req, res, data => {
      return res.json(data)
    })
  },

  getTopUser: (req, res) => {
    userService.getTopUser(req, res, data => {
      return res.json(data)
    })
  },

  addFollowing: (req, res) => {
    userService.addFollowing(req, res, data => {
      return res.json(data)
    })
  },

  removeFollowing: (req, res) => {
    userService.removeFollowing(req, res, data => {
      return res.json(data)
    })
  },

  getUserFollowings: (req, res) => {
    userService.getUserFollowings(req, res, data => {
      return res.json(data.user)
    })
  },

  getUserFollowers: (req, res) => {
    userService.getUserFollowers(req, res, data => {
      return res.json(data.user)
    })
  },

  addNoticing: (req, res) => {
    userService.addNoticing(req, res, data => {
      return res.json(data)
    })
  },

  removeNoticing: (req, res) => {
    userService.removeNoticing(req, res, data => {
      return res.json(data)
    })
  },

  getUserTweets: (req, res, callback) => {
    userService.getUserTweets(req, res, data => {
      return res.json(data)
    })
  }
}

module.exports = userController

const adminService = require('../../services/adminService.js')

const adminController = {
  signIn: (req, res) => {
    adminService.signIn(req, res, (data) => {
      if (data['message'] === 'no such user found') {
        return res.status(401).json(data)
      }
      return res.json(data)
    })
  },

  getUsers: (req, res) => {
    adminService.getUsers(req, res, (data) => {
      return res.json(data)
    })
  },

  getUsersLight: (req, res) => {
    adminService.getUsersLight(req, res, (data) => {
      return res.json(data)
    })
  },

  getTweets: (req, res) => {
    adminService.getTweets(req, res, (data) => {
      return res.json(data)
    })
  },

  deleteTweet: (req, res) => {
    adminService.deleteTweet(req, res, (data) => {
      return res.json(data)
    })
  }
}

module.exports = adminController

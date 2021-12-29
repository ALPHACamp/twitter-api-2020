const adminService = require('../../services/adminService')

const adminController = {
  signIn: (req, res) => {
    adminService.signIn(req, res, data => {
      return res.json(data)
    })
  },

  getUsers: (req, res) => {
    adminService.getUsers(req, res, data => {
      return res.json(data)
    })
  },

  getTweets: (req, res) => {
    adminService.getTweets(req, res, data => {
      return res.json(data)
    })
  },
  deleteTweet: (req, res) => {
    adminService.deleteTweet(req, res, data => {
      return res.json(data)
    })
  }
}

module.exports = adminController

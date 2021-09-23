const adminService = require('../services/adminService')

const adminController = {
  getTweets: (req, res) => {
    adminService.getTweets(req, res, (data) => res.status(data.status).json(data))
  },
  removeTweet: (req, res) => {
    adminService.removeTweet(req, res, (data) => res.json(data))
  },
  getUsers: (req, res) => {
    adminService.getUsers(req, res, (data) => res.status(data.status).json(data.users))
  }
}

module.exports = adminController
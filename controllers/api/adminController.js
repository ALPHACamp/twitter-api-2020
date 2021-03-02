const adminService = require('../../services/adminService')


const adminController = {
  signIn: (req, res) => {
    adminService.signIn(req, res, (data) => res.json(data))
  },
  getUsers: (req, res) => {
    adminService.getUsers(req, res, (data) => res.json(data))
  },
  getTweets: (req, res) => {
    adminService.getTweets(req, res, (data) => res.json(data))
  },
  deleteTweets: (req, res) => {
    adminService.deleteTweets(req, res, (data) => res.json(data))
  }
}

module.exports = adminController
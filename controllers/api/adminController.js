const db = require('../../models')
const Tweet = db.Tweet
const User = db.User
const adminService = require('../../services/adminService')


const adminController = {
  signIn: (req, res) => { },
  getUsers: (req, res) => {
    adminService.getUsers(req, res, (data) => {
      res.json(data)
    })
  },
  getTweets: (req, res) => { },
  deleteTweets: (req, res) => { }
}

module.exports = adminController
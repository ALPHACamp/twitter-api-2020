const db = require('../../models')
const Tweet = db.Tweet
const User = db.User
const adminService = require('../../services/adminService')


const adminController = {
  signIn: (req, res) => { },
  getUsers: (req, res) => { },
  getTweets: (req, res) => { },
  deleteTweets: (req, res) => { }
}

module.exports = adminController
const db = require('../models')
const Tweet = db.Tweet
const User = db.User


const adminService = {
  signIn: (req, res, callback) => { },
  getUsers: (req, res, callback) => { },
  getTweets: (req, res, callback) => { },
  deleteTweets: (req, res, callback) => { }
}

module.exports = adminService
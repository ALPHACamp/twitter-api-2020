const db = require('../../models')
const adminService = require("../../services/adminService")


let adminController = {
  getUsers: (req, res) => {
    adminService.getUsers(req, res, (data) => {
      return res.json(data)
    })
  },
  getUser: (req, res) => {
    adminService.getUser(req, res, (data) => {
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
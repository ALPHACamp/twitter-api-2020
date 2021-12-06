// 載入所需套件
const adminService = require('../services/adminService')

const adminController = {
  adminLogin: async (req, res) => {
    try {
      await adminService.adminLogin(req, res, data => {
        return res.json(data)
      })
    } catch (err) {
      return res.status(401).json({ status: err.name, message: err.message })
    }
  },

  getAllTweets: (req, res) => {
    adminService.getAllTweets(req, res, data => {
      return res.json(data)
    })
  },

  deleteTweet: async (req, res) => {
    try {
      await adminService.deleteTweet(req, res, data => {
        return res.json(data)
      })
    } catch (err) {
      return res.status(400).json({ status: err.name, message: err.message })
    }
  },

  getAllUsers: (req, res) => {
    adminService.getAllUsers(req, res, data => {
      return res.json(data)
    })
  }
}

// adminService exports
module.exports = adminController
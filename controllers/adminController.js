// 載入所需套件
const adminService = require('../services/adminService')

const adminController = {
  adminLogin: (req, res) => {
    adminService.adminLogin(req, res, data => {
      if (data.status === 'error') {
        return res.status(401).json(data)
      }
      return res.json(data)
    })
  },

  getAllTweets: (req, res) => {
    adminService.getAllTweets(req, res, data => {
      return res.json(data)
    })
  }
}

// adminService exports
module.exports = adminController
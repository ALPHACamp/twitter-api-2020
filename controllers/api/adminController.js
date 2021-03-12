const adminService = require('../../services/adminService')


const adminController = {
  signIn: (req, res) => {
    adminService.signIn(req, res, (data) => {
      if (data.status === 'error') return res.status(data.statusCode).json(data)
      return res.json(data)
    })
  },
  getUsers: (req, res) => {
    adminService.getUsers(req, res, (data) => {
      if (data.status === 'error') return res.status(data.statusCode).json(data)
      return res.json(data)
    })
  },
  getTweets: (req, res) => {
    adminService.getTweets(req, res, (data) => {
      if (data.status === 'error') return res.status(data.statusCode).json(data)
      return res.json(data)
    })
  },
  deleteTweets: (req, res) => {
    adminService.deleteTweets(req, res, (data) => {
      if (data.status === 'error') return res.status(data.statusCode).json(data)
      return res.json(data)
    })
  }
}

module.exports = adminController
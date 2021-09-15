const adminService = require('../services/adminService')

const adminController = {
  getTweets: (req, res) => {
    adminService.getTweets(req, res, (data) => res.render('admin/tweets', data))
  },
  removeTweet: (req, res) => {
    adminService.removeTweet(req, res, (data) => {
      if (data['status'] === 'success') {
        res.redirect('back')
      }
    })
  },
  getUsers: (req, res)   => {
    adminService.getUsers(req, res, (data) => res.render('admin/users', data))
  }
}

module.exports = adminController

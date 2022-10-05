const adminServices = require('../services/admin-services')
const adminController = {
  signIn: (req, res, next) => {
    return adminServices.signIn(req, (err, data) => {
      err ? next(err) : res.json({ status: 'success', data })
    })
  },
  getUsers: (req, res, next) => {
    return adminServices.getUsers(req, (err, data) => {
      err ? next(err) : res.json({ status: 'success', data })
    })
  },
  deleteTweets: (req, res, next) => {
    return adminServices.deleteTweets(req, (err, data) => {
      err ? next(err) : res.json({ status: 'success', data })
    })
  }
}
module.exports = adminController

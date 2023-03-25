const adminServices = require('../../services/admin-services')

const adminController = {
  getUsers: (req, res, next) => {
    adminServices.getUsers(req, (err, data) => err ? next(err) : res.json(data))
  },
  deleteTweet: (req, res, next) => {
    adminServices.deleteTweet(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  signIn: (req, res, next) => {
    adminServices.singIn(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', data }))
  }
}

module.exports = adminController

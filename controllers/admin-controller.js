const adminServices = require('../services/admin-services')
const adminController = {
  signIn: (req, res, next) => {
    adminServices.signIn(req, (err, data) =>
      err ? next(err) : res.status(200).json({ status: 'success', data }))
  },
  getTweets: (req, res, next) => {
    adminServices.getTweets(req, (err, data) =>
      err ? next(err) : res.status(200).json({ status: 'success', data }))
  },
  deleteTweet: (req, res, next) => {
    adminServices.deleteTweet(req, (err, data) =>
      err ? next(err) : res.status(200).json({ status: 'success', data }))
  },
  getUsers: (req, res, next) => {
    adminServices.getUsers(req, (err, data) =>
      err ? next(err) : res.status(200).json(data))
  },
}
module.exports = adminController
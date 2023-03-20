const adminServices = require('../services/admin-services')
const adminController = {
  getTweets: (req, res, next) => {
    adminServices.getTweets(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  deleteTweet: (req, res, next) => {
    adminServices.deleteTweet(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  }
}
module.exports = adminController

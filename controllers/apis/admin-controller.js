const adminServices = require('../../services/admin-services')
const adminController = {
  getTweets: (req, res, next) => {
    adminServices.getTweets(req, (err, data) => err ? next(err) : res.json(data))
  }
}
module.exports = adminController
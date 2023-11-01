const { Tweet } = require('../models')
const adminServices = {
  getTweets: (req, cb) => {
    Tweet.findAll({
      raw: true,
      nest: true,
    })
      .then(tweets => cb(null, { tweets }))
      .catch(err => cb(err))
  }
}
module.exports = adminServices
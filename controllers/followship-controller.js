const followshipServices = require('../services/followship-services')

const tweetController = {
  followSomeone: (req, res, next) => {
    followshipServices.followSomeone(req, (err, data) => err ? next(err) : res.status(200).json(data))
  }
}
module.exports = tweetController

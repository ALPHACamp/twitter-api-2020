const tweetServices = require('../services/tweet-services')

const tweetController = {
  addLike: (req, res, next) => {
    tweetServices.addLike(req, (err, addlike) => err ? next(err) : res.json(addlike))
  }
}

module.exports = tweetController
const tweetServices = require('../services/tweet-services')

const tweetController = {
  addLike: (req, res, next) => {
    tweetServices.addLike(req, (err, addlike) => err ? next(err) : res.json(addlike))
  },
  removeLike: (req, res, next) => {
    tweetServices.removeLike(req, (err, removelike) => err ? next(err) : res.json(removelike))
  }
}

module.exports = tweetController
const { Tweet } = require('../models')

const adminController = {
  deleteTweet: (req, cb) => {
    return Tweet.findByPk(req.params.id)
    .then(tweet => {
      if (!tweet) throw new Error('Restaurant did not exist!')
      return tweet.destory()
    })
    .then(deletetweet => cb(null, deletetweet))
    .catch(err => cb(err))
  }
}

module.exports = adminController
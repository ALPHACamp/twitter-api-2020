const { User, Tweet } = require('../models')
const adminServices = {
  getUsers: (req, cb) => {
    return User.findAll({
      raw: true
    })
      .then(users => cb(null, users))
      .catch(err => cb(err))
  },
  deleteTweets: (req, cb) => {
    return Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) {
          const err = new Error("Tweet didn't exist!")
          err.status = 404
          throw err
        }
        return tweet.destroy()
      })
      .then(deletedTweet => cb(null, { tweet: deletedTweet }))
      .catch(err => cb(err))
  }
}
module.exports = adminServices

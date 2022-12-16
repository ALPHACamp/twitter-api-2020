const { User, Tweet } = require('./../models')
const adminServices = {
  getUsers: (req, cb) => {
    return User.findAll({
      nest: true,
      raw: true
    })
      .then(users => {
        users.forEach(user => delete user.password)
        return cb(null, users)
      })
      .catch(err => cb(err))
  },
  deleteTweet: (req, cb) => {
    const TweetId = req.params.tweetId
    return Tweet.findByPk(TweetId)
      .then(tweet => {
        if (!tweet) throw new Error('Tweet does not exist!')
        return tweet.destroy()
      })
      .then(deletedTweet => cb(null, { status: 'success', deletedTweet })
      )
      .catch(err => cb(err))
  }
}
module.exports = adminServices

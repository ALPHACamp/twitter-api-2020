const { Tweet, User, Like } = require('../models')

const adminController = {
  deleteTweet: (req, cb) => {
    return Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) throw new Error('Tweet did not exist!')
        return tweet.destroy()
      })
      .then(tweet => cb(null, tweet))
      .catch(err => cb(err))
  },
  getUsers: (req, cb) => {
    return User.findAll({
      include: [
        Tweet,
        Like,
        { model: User, as: 'Followings'},
        { model: User, as: 'Followers'}
      ]
    })
    .then(users => cb(null, users))
    .catch(err => cb(err))
  },
}

module.exports = adminController
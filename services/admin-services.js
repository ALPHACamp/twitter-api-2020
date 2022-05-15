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
    .then(user => {
      const dataUser = user.map(u => ({
        ...u.toJSON(),
        Tweets: u.Tweets.length,
        Likes: u.Likes.length,
        Followers: u.Followers.length,
        Followings: u.Followings.length
      }))
        .sort((a, b) => b.Tweets - a.Tweets)
      return cb(null, dataUser)
    })
    .catch(err => cb(err))
  },
}

module.exports = adminController
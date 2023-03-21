const { Followship, Like, Reply, Tweet, User } = require('../models')

const adminController = {
  getUsers: (req, res, next) => {
    return User.findAll({
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Like, as: 'likeId' },
        { model: Tweet, as: 'tweetId' }
      ]
    })
      .then(users => {
        res.json({ status: 'success', users })
      })
      .catch(err => next(err))
  }
}

module.exports = adminController

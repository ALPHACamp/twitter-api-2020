const { Like, Tweet, User } = require('../models')

const adminController = {
  getUsers: (req, res, next) => {
    return User.findAll({
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Like },
        { model: Tweet }
      ]
    })
      .then(users => {
        res.json({ status: 'success', users })
      })
      .catch(err => next(err))
  }
}

module.exports = adminController

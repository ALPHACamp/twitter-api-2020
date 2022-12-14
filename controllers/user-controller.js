const assert = require('assert')
const { User, Reply, Tweet, Like } = require('../models')

const userController = {
  getUser: (req, res, next) => {
    const { id } = req.params
    return User.findByPk(id, {
      include: [
        Reply, Tweet, Like,
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ],
      nest: true
    })
      .then(user => {
        if (!user) assert(user, "User doesn't exist!")
        res.json({ status: 'success', data: user })
      })
      .catch(err => next(err))
  }
}

module.exports = userController

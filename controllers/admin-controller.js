const { User } = require('../models')

const adminController = {
  getUsers: (req, res, next) => {
    return User.findAll({
      raw: true
    })
      .then(users => {
        res.json({
          status: 'success',
          users
        })
      })
      .catch(err => next(err))
  }
}

module.exports = adminController

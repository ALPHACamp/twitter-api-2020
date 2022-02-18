const { User } = require('../models')

const adminServices = {
  getUsers: (req, cb) => {
    return User.findAll({
      where: { role: 'user' },
      raw: true
    })
      .then(users => { return users })
      .catch(err => cb(err))
  }
}

module.exports = adminServices
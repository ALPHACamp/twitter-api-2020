const { User } = require('./../models')
const adminServices = {
  getUsers: (req, cb) => {
    return User.findAll({
      nest: true,
      raw: true
    })
      .then(users => {
        return cb(null, users)
      })
      .catch(err => cb(err))
  }
}
module.exports = adminServices

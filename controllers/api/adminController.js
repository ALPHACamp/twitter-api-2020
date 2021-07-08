const db = require('../../models')
const User = db.User

let defaultLimit = 10

let adminController = {
  getUsers: (req, res) => {
    const options = {
      limit: +req.query.limit || defaultLimit,
      offset: +req.query.offset || 0,
      raw: true,
      attributes: { exclude: ['password', 'updatedAt', 'createdAt'] }
    }
    User.findAll(options)
      .then((users) => {
        users.forEach((user) => {
          if (user.introduction) {
            user.introduction = user.introduction.substring(0, 50)
          }
        })
        res.status(200).json(users)
      })
      .catch((error) => {
        res.status(404).json({ status: 'error', message: '' })
      })
  }
}

module.exports = adminController

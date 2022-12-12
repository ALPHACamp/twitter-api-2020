// const bcrypt = require('bcryptjs')
const { User } = require('../models')

const userController = {
  putUser: (req, res, next) => {
    const { account, name, email, password, avatar, introduction, cover } = req.body
    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error('not exist!')
        return user.update(
          account,
          name,
          email,
          password,
          avatar,
          introduction,
          cover
        )
      })
      .then(data => {
        res.json({ status: 'success', data })
      })
      .catch(err => next(err))
  }
}
module.exports = userController

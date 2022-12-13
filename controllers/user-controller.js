// const bcrypt = require('bcryptjs')
const { User, Tweet } = require('../models')

const userController = {
  getUser: (req, res, next) => {
    return Promise.all([
      User.findByPk(req.params.id),
      Tweet.findAndCountAll({
        where: { userId: req.params.id }
      })
    ])
      .then(([user, tweets]) => {
        if(!user) throw new Error('error')
        return User.create
      })

      (data => {
        res.json({ status: 'success', data })
      })
      .catch(err => next(err))
  },
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

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt-nodejs')
const { User } = require('../models')

const userController = {
  signIn: (req, res, next) => {
    const { account, password } = req.body
    if (!account || !password) throw new Error('account and password are required!')

    return User.findOne({ where: { account } })
      .then(user => {
        if (!user) throw new Error('帳號不存在！')
        if (user.role === 'admin') throw new Error('帳號不存在！')
        if (!bcrypt.compareSync(password, user.password)) throw new Error('incorrect account or password!')
        const userData = user.toJSON()
        delete userData.password
        const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
        res.status(200).json({
          status: 'success',
          data: {
            token,
            user: userData
          }
        })
      })
      .catch(err => next(err))
  },
  getUser: (req, res, next) => {
    const { id } = req.params
    return User.findByPk(id, { raw: true })
      .then(user => {
        if (!user) throw new Error('帳號不存在！')
        res.status(200).json({
          status: 'success',
          data: {
            user
          }
        })
      })
      .catch(err => next(err))
  }

}
module.exports = userController

const bcrypt = require('bcryptjs')
const { User } = require('../models')
const { Op } = require('sequelize')
const jwt = require('jsonwebtoken')

const userController = {
  signUp: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    if (password !== checkPassword) {
      const err = new Error("Password don't match")
      err.status = 403
      throw err
    }

    User.findOne({
      where: { [Op.or]: [{ email }, { account }] }
    })
      .then(user => {
        if (user) throw new Error('Email or Account already exists!')

        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        account,
        name,
        email,
        password: hash
      }))
      .then(user => {
        const userData = user.toJSON()
        delete userData.password
        return res.status(200).json({ status: 'success', user: userData })
      })
      .catch(err => next(err))
  },
  signIn: async (req, res, next) => {
    try {
      const { account, password } = req.body
      const user = await User.findOne({ where: { account } })

      if (!user) throw new Error('帳號不存在')
      if (!bcrypt.compareSync(password, user.password)) throw new Error('密碼不正確')

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
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController

const jwt = require('jsonwebtoken')
const { User } = require('../../models')
const bcrypt = require('bcryptjs')

const userController = {
  signUp: async (req, res, next) => {
    try {
      if (req.body.password !== req.body.checkPassword) throw new Error('Passwords do not match!')
      const user = await User.findOne({ where: { email: req.body.email } })
      if (user) throw new Error('Email already exists!')
      const hash = await bcrypt.hash(req.body.password, 10)
      const newUser = await User.create({
        account: req.body.account,
        name: req.body.name,
        email: req.body.email,
        password: hash
      })
      return res.status(200).json({
        "status": "suceess",
        "data": {
          "user": {
            "id": newUser.id,
            "account": newUser.account,
            "name": newUser.name,
            "email": newUser.email,
          }
        }
      })
    } catch (err) {
      next(err)
    }
  },
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  getUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, {
        raw: true,
        nest: true
      })
      return res.status(200).json({
        id: user.id,
        name: user.name,
        account: user.account,
        email: user.email
      })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = userController

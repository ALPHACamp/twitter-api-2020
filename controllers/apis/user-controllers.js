const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User, Identity } = require('../../models')
const helpers = require('../../_helpers')

const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      if (userData.Identity.identity === 'admin') {
        userData.is_admin = true
      } else {
        userData.is_admin = false
      }
      delete userData.password
      delete userData.Identity
      const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: '30d'
      })
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

  signUp: async (req, res, next) => {
    try {
      if (req.body.password !== req.body.passwordCheck) {
        throw new Error('驗證密碼不正確')
      }
      const user = await User.findOne({ where: { account: req.body.account } })
      if (user) throw new Error('使用者已經存在')

      const userIdentity = await Identity.findOne({
        where: { identity: 'user' },
        attributes: ['id']
      })
      const { id } = userIdentity.toJSON()

      const registeredUser = await User.create({
        account: req.body.account,
        name: req.body.name,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 10),
        identityId: id
      })

      const token = jwt.sign(registeredUser.toJSON(), process.env.JWT_SECRET, {
        expiresIn: '30d'
      })
      const rawUserData = await User.findByPk(registeredUser.id)
      const userData = rawUserData.toJSON()
      userData.is_admin = false
      delete userData.password

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
  getCurrentUser: (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      if (userData.Identity.identity === 'admin') {
        userData.is_admin = true
      } else {
        userData.is_admin = false
      }
      delete userData.password
      delete userData.Identity
      const token = jwt.sign(req.user, process.env.JWT_SECRET, {
        expiresIn: '30d'
      })
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
  }
}

module.exports = userController

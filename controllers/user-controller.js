const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')

const { User } = require('../models')

const userController = {
  signIn: (req, res, next) => {
    try {
      if (req.user.error) {
        return res.json(req.user.error)
      }
      const userData = req.user.toJSON()
      delete userData.password
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
      const {account, password, checkPassword, name, email} = req.body

      if (!account || !name || !email || !password || !checkPassword) {
        throw new Error('欄位不可空白！')
      }

      if (password !== checkPassword) {
        throw new Error('密碼與確認密碼不相同！')
      }

      const userExist = await User.findAll({
        where: {
          [Op.or]: [
            { account },
            { email }
          ]
        }
      })

      if (userExist.length > 0) {
        throw new Error('帳號或信箱已經有人使用了！')
      }

      const hash = await bcrypt.hash(password, 10)
      const user = await User.create({
        name,
        account,
        email,
        password: hash,
        role: 'user'
      })
      userData = user.toJSON()
      delete userData.password
      return res.json({ status: 'success', user: userData })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = userController
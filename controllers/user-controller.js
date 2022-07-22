const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')
const { User } = require('../models')
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs')

const userController = {
  signin: async (req, res, next) => {
    try {
      if (req.user.error) {
        return res.status(StatusCodes.NOT_ACCEPTABLE)
          .json(req.user.error)
      }
      const user = req.user.toJSON()
      if (user.role !== 'user') {
        return res.status(StatusCodes.FORBIDDEN)
          .json({
            status: 'error',
            message: '無使用者權限'
          })
      }
      const payload = {
        id: user.id
      }
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })
      delete user.password
      return res.status(StatusCodes.OK)
        .json({
          status: 'success',
          message: '成功登入',
          token,
          data: user
        })
    } catch (err) {
      next(err)
    }
  },
  signUp: async (req, res, next) => {
    try {
      const account = req.body.account.trim()
      const password = req.body.password.trim()
      const checkPassword = req.body.checkPassword.trim()
      const name = req.body.name.trim()
      const email = req.body.email.trim()
      const emailRegex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/ //eslint-disable-line
      if (!account || !password || !checkPassword || !name || !email) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json(
          {
            status: 'error',
            message: '必填欄位不可空白'
          })
      }

      if (password !== checkPassword) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json(
          {
            status: 'error',
            message: '密碼與確認密碼不相符'
          })
      }

      if (!emailRegex.test(email)) {
        return res.status(StatusCodes.NOT_ACCEPTABLE)
          .json({
            status: 'error',
            message: '信箱格式不符合'
          })
      }

      const user = await User.findAll({
        where: {
          [Op.or]: [
            { account },
            { email }
          ]
        }
      })
      if (user.length > 0) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json(
          {
            status: 'error',
            message: 'Account或Email已被使用'
          })
      }
      const hashedPassword = await bcrypt.hash(password, 10)
      await User.create({
        name,
        account,
        email,
        password: hashedPassword,
        isAdmin: false,
        role: 'user'
      })
      return res.status(StatusCodes.OK).json({
        status: 'success',
        message: '成功創建'
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = userController

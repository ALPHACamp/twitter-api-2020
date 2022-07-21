const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')
const { User } = require('../models')

const adminController = {
  signin: async (req, res, next) => {
    try {
      const { account, password } = req.body
      if (!account || !password) {
        return res.status(StatusCodes.NOT_ACCEPTABLE)
          .json({
            status: 'error',
            message: '必欄欄位不可為空'
          })
      }
      let user = await User.findOne({ where: { account } })
      if (!user) {
        return res.status(StatusCodes.NOT_ACCEPTABLE)
          .json({
            status: 'error',
            message: '使用者不存在'
          })
      }
      if (user.role !== 'admin') {
        return res.status(StatusCodes.FORBIDDEN)
          .json({
            status: 'error',
            message: '無管理員權限'
          })
      }
      const payload = {
        id: user.id
      }
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })
      user = await user.toJSON()
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
  }
}

module.exports = adminController

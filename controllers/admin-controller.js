const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')
const { User } = require('../models')

const adminController = {
  signin: async (req, res, next) => {
    try {
      if (req.user.error) {
        return res.status(StatusCodes.NOT_ACCEPTABLE)
          .json(req.user.error)
      }
      const user = req.user.toJSON()
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
  getUsers: async (req, res, next) => {
    try {
      let users = await User.findAll()
      users = await users.map(user => ({ ...user.toJSON() }))
      return res.status(StatusCodes.OK).json(users)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = adminController

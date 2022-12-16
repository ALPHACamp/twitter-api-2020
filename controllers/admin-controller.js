const assert = require('assert')
const jwt = require('jsonwebtoken')
const { User } = require('../models')
const { getOffset, getUser } = require('../_helpers')

const superUser = { name: 'root', email: 'root@example.com' }

const adminController = {
  adminLogin: async (req, res, next) => {
    try {
      // token(效期30天)
      const userData = getUser(req).toJSON()
      if (userData.role !== 'admin') return res.json({ status: 'error', message: '帳號不存在！' })
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      return res.status(200).json({
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
  getUsers: async (req, res, next) => {
    try {
      const DEFAULT_LIMIT = 10
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)

      const users = await User.findAll({
        limit,
        offset,
        nest: true,
        raw: true
      })

      res.json({ status: 'success', data: users })
    } catch (err) {
      next(err)
    }
  },
  patchUser: async (req, res, next) => {
    try {
      const { role } = req.body
      const { id } = req.params
      const user = await User.findByPk(id)
      if (user.email === superUser.email) assert(user, `禁止變更${superUser.name}權限`)
      const updateUser = await user.update({ role })
      res.json({ status: 'success', data: updateUser })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController

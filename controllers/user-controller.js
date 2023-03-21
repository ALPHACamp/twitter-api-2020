const jwt = require('jsonwebtoken')
const { getUser } = require('../_helpers')
const createError = require('http-errors')

const userController = {
  login: (req, res, next) => {
    try {
      const loginUser = getUser(req).toJSON()
      if ((req.originalUrl === '/api/users/login' && loginUser.role !== 'user') || (req.originalUrl === '/api/admin/login' && loginUser.role !== 'admin')) throw createError(404, '帳號不存在')

      const token = jwt.sign({ id: loginUser.id }, process.env.JWT_SECRET, { expiresIn: '30d' })

      return res.json({
        status: 'success',
        message: '登入成功',
        token
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = userController

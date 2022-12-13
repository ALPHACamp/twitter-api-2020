const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')
const dayjs = require('dayjs')
const userController = {
  signIn: (req, res, next) => {
    try {
      const loginUser = helpers.getUser(req).toJSON()
      if (loginUser?.role === 'admin') return res.status(403).json({ status: 'error', message: 'Permission denied.' })
      delete loginUser.password
      loginUser.createdAt = dayjs(loginUser.createdAt).valueOf()
      loginUser.updatedAt = dayjs(loginUser.updatedAt).valueOf()
      const token = jwt.sign(loginUser, process.env.JWT_SECRET, { expiresIn: '5d' })
      res.status(200).json({ status: 'success', data: { token, user: loginUser } })
    } catch (err) { next(err) }
  }
}

module.exports = userController

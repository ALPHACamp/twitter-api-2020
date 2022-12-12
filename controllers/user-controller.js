const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')
const userController = {
  signIn: (req, res, next) => {
    try {
      const loginUser = helpers.getUser(req).toJSON()
      if (loginUser?.role === 'admin') return res.status(403).json({ status: 'error', message: 'Permission denied.' })
      delete loginUser.password
      const token = jwt.sign(loginUser, process.env.JWT_SECRET, { expiresIn: '5d' })
      res.status(200).json({ status: 'success', data: { token, user: loginUser } })
    } catch (err) { next(err) }
  }
}

module.exports = userController

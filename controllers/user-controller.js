const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')
<<<<<<< HEAD
=======
const dayjs = require('dayjs')
>>>>>>> 1609435b036c0f9e17c09af833fdee22d5340325
const userController = {
  signIn: (req, res, next) => {
    try {
      const loginUser = helpers.getUser(req).toJSON()
      if (loginUser?.role === 'admin') return res.status(403).json({ status: 'error', message: 'Permission denied.' })
      delete loginUser.password
<<<<<<< HEAD
=======
      loginUser.createdAt = dayjs(loginUser.createdAt).valueOf()
      loginUser.updatedAt = dayjs(loginUser.updatedAt).valueOf()
>>>>>>> 1609435b036c0f9e17c09af833fdee22d5340325
      const token = jwt.sign(loginUser, process.env.JWT_SECRET, { expiresIn: '5d' })
      res.status(200).json({ status: 'success', data: { token, user: loginUser } })
    } catch (err) { next(err) }
  }
}

module.exports = userController

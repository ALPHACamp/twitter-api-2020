const jwt = require('jsonwebtoken')

const adminController = {
  login: (req, res, next) => {
    try {
      // 製作token給管理員
      const userData = req.user
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.status(200).json({
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

module.exports = adminController

const jwt = require('jsonwebtoken')

const adminController = {
  signIn: (req, res, next) => {
    try {
      if (req.user.error) {
        return res.json(req.user.error)
      }

      if (req.user.role !== 'admin') {
        res.json({
          status: 'error',
          message: '帳號或密碼錯誤'
        })
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
  }
}

module.exports = adminController

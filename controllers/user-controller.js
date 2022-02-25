const jwt = require('jsonwebtoken')

const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: '1d'
      })
      res.json({
        token,
        user: userData
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController

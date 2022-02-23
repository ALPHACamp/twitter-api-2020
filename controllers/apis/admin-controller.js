const jwt = require('jsonwebtoken')
const TOKEN_EXPIRES = process.env.TOKEN_EXPIRES || '30m'

const adminController = {
  signIn: (req, res) => {
    const userData = req.user.toJSON()
    delete userData.password
    const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRES })
    res.json({
      status: 'success',
      data: {
        token,
        user: userData
      }
    })
  }
}

module.exports = adminController

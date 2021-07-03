const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userService = require('../services/userService')

const userController = {
  signIn: async (req, res, next) => {
    try {
      const { email, password } = req.body
      if (!email || !password) {
        throw new Error('Required fields did not exist. (email or password)')
      }
      const user = await userService.signIn(email)
      if (!user) {
        throw new Error('No such user found.')
      }
      if (!bcrypt.compareSync(password, user.password)) {
        throw new Error('Incorrect password word.')
      }

      const payload = { id: user.id }
      const token = jwt.sign(payload, 'JWTSecretIsWeird')
      return res.json({
        status: 200,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      })
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = userController

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User } = require('../models')

const userController = {
  login: async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(422).json({
        status: 'error',
        message: 'Missing email or password!'
      })
    }
    try {
      let user = await User.findOne({ where: { email } })

      // User not found
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: "This account doesn't exist."
        })
      }

      // Password incorrect
      if (!bcrypt.compareSync(password, user.password))
        return res.status(401).json({
          status: 'error',
          message: 'Incorrect password.'
        })

      user = user.toJSON()
      // Issue a token to user
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '7d' })
      return res.json({
        status: 'success',
        data: {
          token,
          user
        }
      })
    } catch (error) {
      next(error)
    }
  },

  // User sign up for new account
  register: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body

      // Double check password
      if (password !== checkPassword)
        throw new Error('Please check your password again!')

      // Check if user exists
      const user = await User.findOne({ where: { email } })
      if (user) throw new Error('Email already exists!')

      // Check if account is used
      const accountIsUsed = await User.findOne({ where: { account } })
      if (accountIsUsed) throw new Error('Account is used.')

      // Create new user
      const hash = bcrypt.hashSync(password, 10)
      const newUser = await User.create({
        account,
        name,
        email,
        password: hash,
        role: 'user'
      })

      // Protect sensitive user info
      newUser.password = undefined

      return res.json({ newUser })
    } catch (error) {
      next(error)
    }
  },

  // To-do: it's just for auth test !!!!!!!!
  getUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, { raw: true })
      // return ONLY user object to satisfy the test... :(
      return res.json(user)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = userController

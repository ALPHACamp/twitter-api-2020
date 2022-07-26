const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { User } = require('../models')
const { Op } = require('sequelize')

const userController = {
  signin: async (req, res) => {
    const { account, password } = req.body

    // Check if any field remains blank
    if (!account?.trim() || !password?.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'All fields are required.'
      })
    }

    // Find user
    const user = await User.findOne({
      where: {
        account,
        role: 'user'
      }
    })

    // Check if admin exists and password correct
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({
        status: 'error',
        message: 'Account or password incorrect.'
      })
    }

    // Generate token
    const payload = { id: user.id }
    const token = jwt.sign(payload, process.env.JWT_SECRET)

    return res.status(200).json({
      status: 'success',
      message: 'Login success.',
      token,
      data: {
        user: {
          id: user.id,
          name: user.name,
          account: user.account,
          email: user.email,
          role: user.role
        }
      }
    })
  },
  signup: async (req, res) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      if (!account || !name || !email || !password || !checkPassword) {
        return res.status(401).json({
          status: 'error',
          message: 'All fields required.'
        })
      }
      if (password !== checkPassword) {
        return res.status(401).json({
          status: 'error',
          message: 'Password and checkPassword should be the same.'
        })
      }
      const result = await User.findOne({
        where: { [Op.or]: [{ account }, { email }] }
      })
      if (result) {
        return res.json({
          status: 'error',
          message: 'Account or email exist. Please try another one.'
        })
      }

      const userData = await User.create({
        account,
        name,
        email,
        password: bcrypt.hashSync(password, 10)
      })
      const user = userData.toJSON()
      delete user.password
      return res.status(200).json({
        status: 'success',
        message: 'Sign up success.',
        data: {
          user: {
            id: user.id,
            name: user.name,
            account: user.account,
            role: user.role
          }
        }
      })
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = userController

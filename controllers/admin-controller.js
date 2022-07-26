const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { User } = require('../models')

const adminController = {
  signin: async (req, res) => {
    const { account, password } = req.body

    // Check if any field remains blank
    if (!account.trim() || !password.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'All fields are required.'
      })
    }

    // Find admin
    const user = await User.findOne({
      where: {
        account,
        role: 'admin'
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
  }
}

module.exports = adminController

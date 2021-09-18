const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User, Tweet, Reply, Like, Followship, Sequelize } = require('../models')
const sequelize = require('sequelize')

const adminService = {
  adminSignIn: async (account, password) => {
    const user = await User.findOne({ where: { account } })
    if (!user) {
      return { status: 'error', message: 'no such user found' }
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return { status: 'error', message: 'passwords did not match' }
    }
    if (user.role !== 'admin') {
      return {
        status: 'error',
        message: 'Cannot access this account',
      }
    }
    // Give token
    const payload = { id: user.id }
    const token = jwt.sign(payload, process.env.JWT_SECRET)

    return {
      status: 'success',
      message: 'Successfully login',
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }
  },
}

module.exports = adminService
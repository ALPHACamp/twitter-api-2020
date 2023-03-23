const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const validator = require('validator')

const helpers = require('../_helpers')
const sequelize = require('sequelize')
const { User } = require('../models')

const userController = {
  signIn: async (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      return res.json({
        status: 'success',
        data: {
          token,
          user: userData,
        },
      })
    } catch (err) {
      next(err)
    }
  },
  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      const errors = []
      
      //check if all the required fields are filled out correctly
      if (!account || !name || !email || !password || !checkPassword) {
        errors.push('All fields are required!')
      }
      if (name && !validator.isByteLength(name, { max: 50 })) {
        errors.push('The name cannot exceed 50 characters.')
      }
      if (password && !validator.isByteLength(password, { min: 8, max: 20 })) {
        errors.push('The password length should be between 8 to 20 characters.')
      }
      if (password !== checkPassword) {
        errors.push('Passwords do not match!')
      }
      if (email && !validator.isEmail(email)) {
        errors.push('Please enter the valid email address!')
      }

      // Check if account and email are unique
      const [userAccount, userEmail] = await Promise.all([
        User.findOne({ where: { account } }),
        User.findOne({ where: { email } }),
      ])
      if (userAccount) errors.push('Account already exists')
      if (userEmail) errors.push('Email already exists')

      // Return error message if there are errors
      if (errors.length) {
        return res.status(400).json({ status: 'error', errors })
      }

      // Hash password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      // Create user in DB
      await User.create({
        account,
        name,
        email,
        password: hashedPassword,
      })

      return res.status(200).json({ status: 'success', message: 'Successfully signed up!' })
    } catch (err) {
      next(err)
    }
  },
  getUserLikes: (req, res, next) => {
    const { userId } = req.params
    User.findByPk(userId, {
      include: [{model: like, include:[{model: tweet, include: [Like, Reply, User]}]}],
      order: 

    })


  }
}

module.exports = userController

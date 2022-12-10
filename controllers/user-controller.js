const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const { User } = require('../models')

const userController = {
  register: async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        const errorMessage = errors.errors.map(e => e.msg)
        throw new Error(errorMessage)
      }
      const { name, account, email, password } = req.body
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)
      let registeredUser = await User.create({ name, account, email, password: hash })
      registeredUser = registeredUser.toJSON()
      delete registeredUser.password
      res.status(200).json({ user: registeredUser })
    } catch (err) {
      next(err)
    }
  },
  login: async (req, res, next) => {
    try {
      // check account and password
      const { account, password } = req.body
      const user = await User.findOne({
        where: { account, role: 'user' },
        attributes: { exclude: ['createdAt', 'updatedAt'] }
      })
      if (!user) return res.status(401).json({ status: 'error', message: '帳號不存在' })
      const isPasswordCorrect = await bcrypt.compare(password, user.password)
      if (!isPasswordCorrect) return res.status(401).json({ status: 'error', message: '帳號或密碼錯誤' })
      // sign token
      const userData = user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '14d' })
      res.status(200).json({ token, user: userData })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController

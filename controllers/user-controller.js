const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')

const { User } = require('../models')

const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      if (userData.role !== 'user') throw new Error('no such user(角色錯誤)') // 角色若不是user則不發給token

      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
      return res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      return next(err)
    }
  },
  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password, passwordCheck } = req.body
      if (password !== passwordCheck) throw new Error('Passwords do not match!')

      // 確認name是否在50字之內
      if (name.length > 50) throw new Error('Name is over 50 chars!')

      // 確認account或email是否重複
      let user = await User.findOne({ where: { [Op.or]: [{ account }, { email }] } })
      if (user) throw new Error('Account or Email already exists!')

      const hash = await bcrypt.hash(password, 10)
      user = await User.create({
        account,
        name,
        email,
        password: hash,
        role: 'user',
        banner: 'https://images.unsplash.com/photo-1580436541340-36b8d0c60bae'
      })

      const userData = user.toJSON()
      delete userData.password

      return res.json({ status: 'success', data: userData })
    } catch (err) {
      return next(err)
    }
  }
}

module.exports = userController

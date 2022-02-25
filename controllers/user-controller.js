const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const { User, Followship, Tweet } = require('../models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const { imgurFileHandler } = require('../helpers/file-helpers')
const userController = {
  signUp: async (req, res, next) => {
    try {
      const { name, account, email, password, checkPassword } = req.body
      if (!name || !account || !email || !password || !checkPassword) {
        return res.status(400).json({
          status: 'error',
          message: '欄位必須全部填完' 
        })
      }
      if (email && !validator.isEmail(email)) {
        return res.status(400).json({
          status: 'error',
          message: '請輸入正確信箱格式'
        })
      }
      if (password && !validator.isByteLength(password, { min: 4 })) {
        return res.status(400).json({
          status: 'error',
          message: '密碼請輸入至少 4 個!'
        })
      }
      if (password !== checkPassword) {
        return res.status(400).json({
          status: 'error',
          message: '兩次密碼不相符'
        })
      }
      if (name && !validator.isByteLength(name, { min: 0, max: 50 })) {
        return res.status(400).json({
          status: 'error',
          message: '名字長度不能超過 50 個字'
        })
      }

      const checkedUser = await User.findOne({
        where: {
          [Op.or]: [{ account }, { email }]
        },
        raw: true
      })
      if (checkedUser) return res.status(400).json({
        status: 'error',
        message: 'account 或 email 已註冊!'
      })
      console.log(checkedUser)
      const user = await User.create({
        name,
        account,
        email,
        role: 'user',
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
      })
      console.log(user)
      return res.status(200).json({
        status: 'success',
        message: 'Account success created!'
      })
    } catch (err) { next(err) }
  },
  signIn: async (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'success',
        message: 'login success!',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) { next(err) }
  },
  getUser: async (req, res, next) => {
    try {
      const { uid: id } = req.params
      const userData = await User.findByPk(id, {
        raw: true
      })
      if (!userData) return res.status(400).json({
        status: 'error',
        message: 'User not found!'
      })
      const followData = await Followship.findAll({
        where: {},
        raw: true
      })
      res.json({
        status: 'success',
        message: 'getUser success!',
        data: userData
      })
    } catch (err) { next(err) }
  },
  getUserTweets: async (req, res, next) => {
    try {
      const { uid: id } = req.params
      const tweetsData = await Tweet.findAll({
        where: { UserId: id },
        raw: true
      })
      if (tweetsData.length === 0) return res.status(400).json({
        status: 'error',
        message: 'Tweet not found!'
      })
      res.json({
        status: 'success',
        message: 'getTweets success!',
        data: tweetsData
      })
    } catch (err) { next(err) }
  }

}

module.exports = userController
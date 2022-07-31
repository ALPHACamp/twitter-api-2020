const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../models')
const { User } = db
const userServices = require('../services/user-services')
const helpers = require('../_helpers')
const { Op } = require("sequelize")
const { imgurFileHandler } = require('../helpers/file-helpers')


const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      delete userData.password
      const token = jwt.sign(userData, 'secret', { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
      res.json({
        status: 'success',
        message: '成功登入',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  signUp: async (req, res, next) => {
    try {
      if (req.body.password !== req.body.checkPassword) throw new Error('Passwords do not match!')
      if (req.body.name && req.body.name.length > 50) throw new Error('名稱不可超過５０字')
      const foundEmail = await User.findOne({ where: { email: req.body.email } })
      const foundAccount = await User.findOne({ where: { account: req.body.account } })
      // !有餘力再來優化程式
      let errorMessage = []
      if (foundEmail) {
        errorMessage += 'email 已重複註冊！'
      }
      if (foundAccount) {
        errorMessage += 'account 已重複註冊！'
      }
      if (errorMessage.length > 0) {
        throw new Error(errorMessage)
      }
      const hash = await bcrypt.hash(req.body.password, 10)
      const data = await User.create({
        account: req.body.account,
        name: req.body.name,
        email: req.body.email,
        password: hash,
        avatar: `https://loremflickr.com/320/240/cat/?lock=${Math.random() * 100}`,
        cover: 'https://i.imgur.com/hCJiDle.png',
        role: 'user'
      })
      res.json({
        status: 'success',
        message: '成功註冊',
        data
      })
    } catch (err) {
      next(err)
    }
  },
  getUser: async (req, res, next) => {
    try {
      const id = req.params.id
      const data = await User.findByPk(id, {
        attributes: { exclude: ['password'] }
      })
      if (!data || data.role === 'admin') throw new Error("user doesn't exist!")
      res.json({
        status: 'success',
        message: '成功登入',
        data
      })
    } catch (err) {
      next(err)
    }
  }, editUser: async (req, res, next) => {
    const currentUserId = helpers.getUser(req).id
    const { account, name, email, password, checkPassword, introduction } = req.body
    const id = req.params.id
    const avatarImg = req.files.avatar ? req.files.avatar : []
    const coverImg = req.files.cover ? req.files.cover : []
    try {
      if (Number(currentUserId) !== Number(id)) throw new Error('無法修改其他使用者之資料!')
      if (!account || !name || !email || !password || !checkPassword) throw new Error('必填欄位不可空白!')
      if (password !== checkPassword) throw new Error('Passwords do not match!')
      const user = await User.findByPk(id)
      if (!user || user.role === 'admin') throw new Error("user doesn't exist!")
      const foundEmail = await User.findOne({ where: { email, [Op.not]: [{ id }] } })
      const foundAccount = await User.findOne({ where: { account, [Op.not]: [{ id }] } })
      let errorMessage = []
      if (foundEmail) {
        errorMessage += 'email 已重複註冊！'
      }
      if (foundAccount) {
        errorMessage += 'account 已重複註冊！'
      }
      if (errorMessage.length > 0) {
        throw new Error(errorMessage)
      }
      const newPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
      const avatarFile = await imgurFileHandler(...avatarImg)
      const coverFile = await imgurFileHandler(...coverImg)
      const data = await user.update({
        account, name, email, introduction,
        password: newPassword,
        avatar: avatarFile || user.avatar,
        cover: coverFile || user.cover
      })
      res.json({
        status: 'success',
        message: '成功登入',
        data
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
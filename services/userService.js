// 載入所需套件
const { User } = require('../models')
const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')
const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')

const userService = {
  signUp: async (req, res, callback) => {
    const { account, name, email, password, checkPassword } = req.body

    // 確認欄位是否皆有填寫
    if (!account || !name || !email || !password || !checkPassword) {
      return callback({ status: 'error', message: '所有欄位皆為必填' })
    }
    // 確認密碼是否一致
    if (password !== checkPassword) {
      return callback({ status: 'error', message: '兩次密碼不相同' })
    }

    // 確認email或account是否重複
    const user = await User.findOne({ where: { [Op.or]: [{ email }, { account }] } })
    if (user) {
      if (user.email === email) {
        return callback({ status: 'error', message: 'email已重覆註冊！' })
      }
      if (user.account === account) {
        return callback({ status: 'error', message: 'account已重覆註冊！' })
      }
    } else {
      await User.create({
        account,
        email,
        name,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
        role: 'user'
      })
      return callback({ status: 'success', message: '成功註冊' })
    }
  },

  signIn: async (req, res, callback) => {
    const { email, password } = req.body

    // 確認欄位是否皆有填寫
    if (!email || !password) {
      return callback({ status: 'error', message: 'email或password未填寫' })
    }

    // 檢查email＆password＆role
    const user = await User.findOne({ where: { email } })
    if (!user || !bcrypt.compareSync(password, user.password) || user.role === 'admin') {
      return callback({ status: 'error', message: '帳號不存在！' })
    }

    const payload = { id: user.id }
    const token = jwt.sign(payload, process.env.JWT_SECRET)
    return callback({
      status: 'success',
      message: '成功登入',
      token: token,
      user: {
        id: user.id, account: user.account, name: user.name, email: user.email, avatar: user.avatar, cover: user.cover, introduction: user.introduction, role: user.role
      }
    })
  },

  putUserSetting: async (req, res, callback) => {
    const { account, name, email, password, checkPassword } = req.body
    const userId = helpers.getUser(req).id

    // 確認當前使用者和欲修改使用者資料是相同的
    if (userId !== Number(req.params.id)) {
      return callback({ status: 'error', message: '無法變更其他使用者資料' })
    }

    // 確認欄位是否皆有填寫
    if (!account || !name || !email || !password || !checkPassword) {
      return callback({ status: 'error', message: '所有欄位皆需填寫' })
    }

    // 確認密碼是否一致
    if (password !== checkPassword) {
      return callback({ status: 'error', message: '兩次密碼不相同' })
    }

    // 確認email或account是否重複(要排除自己的)
    const check = await User.findOne({ where: { [Op.or]: [{ email }, { account }], [Op.not]: [{ id: userId }] } }) // 利用[Op.not]忽略自己email和account
    if (check) {
      if (check.email === email) {
        return callback({ status: 'error', message: 'email已重覆註冊！' })
      }
      if (check.account === account) {
        return callback({ status: 'error', message: 'account已重覆註冊！' })
      }
    } else {
      await User.update({
        ...req.body,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
      }, { where: { id: userId } })
      return callback({ status: 'success', message: '成功修改使用者帳戶資訊' })
    }
  },

  getCurrentUser: async (req, res, callback) => {
    return callback({ user: helpers.getUser(req) })
  },

  getUser: async (req, res, callback) => {
    const user = (await User.findByPk(req.params.id)).toJSON()
    return callback(user)
  },
}

// userController exports
module.exports = userService
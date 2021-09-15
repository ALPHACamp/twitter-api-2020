const validator = require('validator')
const db = require('../models')
const User = db.User

const helpers = require('../_helpers')

module.exports = {
  registerCheck: async (req) => {
    const { name, account, email, password, checkPassword } = req.body
    const message = []

    // 所有欄位不能為空值
    if (!name || !account || !email || !password || !checkPassword) {
      message.push({ error: 'All columns are required.' })
    }
    // email 格式需正確
    if (email && !validator.isEmail(email)) {
      message.push({ error: 'Incorrect email format.' })
    }
    // password 與 checkPassword 需相等
    if (password !== checkPassword) {
      message.push({ error: 'Password and checkPassword do not match.' })
    }

    // account 與 email 不能重複
    const accountExist = await User.findOne({
      attributes: ['email', 'account'],
      where: { account },
    })
    if (accountExist) {
      message.push({ error: 'Account is exists.' })
    }
    const emailExist = await User.findOne({
      attributes: ['email', 'account'],
      where: { email },
    })
    if (emailExist) {
      message.push({ error: 'Email is exists.' })
    }
    if (message.length > 0) {
      return message
    }
  },
  updateSettingCheck: async (req) => {
    const { name, account, email, password, checkPassword } = req.body
    const message = []

    // 所有欄位不能為空值
    if (!name || !account || !email || !password || !checkPassword) {
      message.push({ error: 'All columns are required.' })
    }
    // email 格式需正確
    if (email && !validator.isEmail(email)) {
      message.push({ error: 'Incorrect email format.' })
    }
    // password 與 checkPassword 需相等
    if (password !== checkPassword) {
      message.push({ error: 'Password and checkPassword do not match.' })
    }

    // account 與 email 不能重複
    const accountExist = await User.findOne({
      attributes: ['id', 'email', 'account'],
      where: { account },
    })
    if (accountExist && accountExist.dataValues.id !== helpers.getUser(req).id) {
      message.push({ error: 'Account is exists.' })
    }
    const emailExist = await User.findOne({
      attributes: ['id', 'email', 'account'],
      where: { email },
    })
    if (emailExist && emailExist.dataValues.id !== helpers.getUser(req).id) {
      message.push({ error: 'Email is exists.' })
    }
    if (message.length > 0) {
      return message
    }
  },
  updateProfile: async (req) => {
    // name 欄位無資料
    const { name, introduction } = req.body
    const message = []
    if (!name) {
      message.push({ error: 'Name is required.' })
    }
    if (name && !validator.isByteLength(name, { min: 0, max: 50 })) {
      message.push({ error: 'Name length can not over 50 characters' })
    }
    if (introduction) {
      if (!validator.isByteLength(introduction, { min: 0, max: 160 })) {
        message.push({
          error: 'Introduction length can not over 160 characters',
        })
      }
    }
    if (message.length > 0) {
      return message
    }
  },
}

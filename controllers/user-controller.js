const jwt = require('jsonwebtoken')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const createError = require('http-errors')
const { getUser } = require('../_helpers')
const { User } = require('../models')

const userController = {
  login: (req, res, next) => {
    try {
      const loginUser = getUser(req)
      if ((req.originalUrl === '/api/users/login' && loginUser.role !== 'user') || (req.originalUrl === '/api/admin/login' && loginUser.role !== 'admin')) throw createError(404, '帳號不存在')

      const token = jwt.sign({ id: loginUser.id }, process.env.JWT_SECRET, { expiresIn: '30d' })
      return res.json({
        status: 'success',
        message: '登入成功',
        token
      })
    } catch (error) {
      next(error)
    }
  },
  register: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body

    if (!account || !name || !email || !password || !checkPassword) throw createError(400, '欄位不得為空')
    if (name.length > 50) throw createError(422, '名稱不能超過 50 個字')
    if (!validator.isEmail(email)) throw createError(422, 'Email 格式有誤')
    if (password !== checkPassword) throw createError(422, '兩次輸入的密碼不相同')

    return Promise.all([
      User.findOne({ where: { account }, raw: true }),
      User.findOne({ where: { email }, raw: true })
    ])
      .then(([foundAccount, foundEmail]) => {
        if (foundAccount) throw createError(422, 'Account 重複註冊')
        if (foundEmail) throw createError(422, 'Email 重複註冊')

        return User.create({ account, name, email, password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)) })
      })
      .then(() => {
        return res.json({
          status: 'success',
          message: '註冊成功'
        })
      })
      .catch(error => next(error))
  }
}

module.exports = userController

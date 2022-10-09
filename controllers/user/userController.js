const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User } = require('../../models')
const helpers = require('../../_helpers')
const { userValidation } = require('../../helper/validations')
const { multerFilesHandler } = require('../../helper/file-helper')
const assert = require('assert')

const userController = {
  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      if (password !== checkPassword) throw new Error('密碼輸入錯誤，請重新確認')
      const [userEmail, userAccount] = await Promise.all([
        User.findOne({ where: { email } }),
        User.findOne({ where: { account } })
      ])

      assert(!userEmail, 'email 已重複註冊！')
      assert(!userAccount, 'account 已重複註冊！')
      const user = await User.create({
        account,
        name,
        email,
        password: await bcrypt.hash(password, 10),
        role: 'user'
      })
      return res.json({ status: 'success', data: user })
    } catch (err) {
      next(err)
    }
  },
  signIn: (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  getUser: async (req, res, next) => {
    try {
      const userId = req.params.id
      const user = await User.findByPk(userId, {
        raw: true,
        nest: true
      })
      assert(user, '使用者不存在')
      res.json(user)
    } catch (error) {
      next(error)
    }
  },
  putUser: async (req, res, next) => {
    const userId = req.params.id
    const { value, error } = userValidation(req.body)
    const { files } = req
    try {
      // 如若輸入的資料不合規範，丟出error
      assert(!error, error?.details[0].message)

      const { account, name, email, password, introduction } = value
      // 將圖片上傳至第三方圖庫
      // 若沒有傳入照片回傳null
      const cover = await multerFilesHandler(
        files.cover ? files.cover[0] : null
      )
      const avatar = await multerFilesHandler(
        files.avatar ? files.avatar[0] : null
      )
      const user = await User.findByPk(userId)
      assert(user, '使用者不存在')
      // 確認 account 、 email 是否重複
      const [accountCheck, emailCheck] = await Promise.all([
        User.findOne({ where: { account }, attributes: ['id'] }),
        User.findOne({ where: { email }, attributes: ['id'] })
      ])
      assert(!(accountCheck && accountCheck.id !== user.id), '帳號已存在')
      assert(!(emailCheck && emailCheck.id !== user.id), '這個email已被使用')
      const updatedUser = await user.update({
        account,
        name,
        email,
        introduction,
        password: await bcrypt.hash(password, 10),
        cover,
        avatar
      })
      res.json({
        status: 'success',
        data: updatedUser
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = userController

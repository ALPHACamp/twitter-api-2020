const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User } = require('../models')
const { imgurFileHandler } = require('../helpers/file-handler')
const helpers = require('../_helpers')

const userController = {
  signUp: (req, res, next) => {
    const { name, account, email, password, checkPassword } = req.body
    if (!name || !account || !email || !password || !checkPassword) throw new Error('所有欄位皆為必填！')
    if (name.length > 50) throw new Error('暱稱字數超出上限！')
    if (password !== checkPassword) throw new Error('密碼與確認密碼不符合！')
    return Promise.all([
      User.findOne({ where: { email } }),
      User.findOne({ where: { account } })
    ])
      .then(([userA, userB]) => {
        if (userA) throw new Error('email已重複註冊！')
        if (userB) throw new Error('account已重複註冊！')
        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({
        name,
        account,
        email,
        password: hash
      }))
      .then(userData => {
        userData = userData.toJSON()
        delete userData.password
        return res.json({
          status: 'success',
          data: { user: userData }
        })
      })
      .catch(err => next(err))
  },
  signIn: (req, res, next) => {
    const userData = helpers.getUser(req).toJSON()
    const JWTSecret = process.env.JWT_SECRET || 'SECRET'
    delete userData.password
    if (userData.role === 'admin') {
      const err = new Error('帳號不存在！')
      err.status = 404
      throw err
    }
    try {
      const token = jwt.sign(userData, JWTSecret, { expiresIn: '30d' })
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
  putUser: async (req, res, next) => {
    try {
      if (helpers.getUser(req).id !== Number(req.params.id)) throw new Error('只能編輯自己的使用者資料！')
      let { name, account, email, password, checkPassword, introduction } = req.body
      const avatar = req.files?.avatar ? await imgurFileHandler(req.files.avatar[0]) : null
      const banner = req.files?.banner ? await imgurFileHandler(req.files.banner[0]) : null

      if (password !== checkPassword) throw new Error('密碼與確認密碼不符合！')
      if (name) {
        if (name.length > 50) throw new Error('使用者暱稱上限為50字！')
      }
      if (introduction) {
        if (introduction.length > 160) throw new Error('自我介紹上限為160字！')
      }
      if (password) {
        password = await bcrypt.hash(password, 10)
      }
      const userA = await User.findByPk(req.params.id)
      if (!userA) {
        const err = new Error('使用者不存在！')
        err.status = 404
        throw err
      }
      // 81~86行，如果使用者輸入的 email 和原本一樣，就不用再去檢查 email 是否存在，不然會顯示 email 已重複註冊
      if (email) {
        if (userA.email !== email) {
          const userB = await User.findOne({ where: { email } })
          if (userB) throw new Error('email已重複註冊！')
        }
      }
      // 同80行註解
      if (account) {
        if (userA.account !== account) {
          const userC = await User.findOne({ where: { account } })
          if (userC) throw new Error('account已重複註冊！')
        }
      }
      let updatedUser = await userA.update({
        name: name || userA.name,
        account: account || userA.account,
        email: email || userA.email,
        password: password || userA.password,
        introduction: introduction || userA.introduction,
        avatar: avatar || userA.avatar,
        banner: banner || userA.banner
      })
      updatedUser = updatedUser.toJSON()
      delete updatedUser.password
      return res.json({ status: 'success', data: { user: updatedUser } })
    } catch (err) {
      return next(err)
    }
  }
}

module.exports = userController

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User } = require('../models')
const { getUser } = require('../_helpers')
const userController = {
  login: (req, res, next) => {
    try {
      const userData = getUser(req).toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
      res.json({
        status: 'success',
        token,
        ...userData
      })
    } catch (err) {
      next(err)
    }
  },
  signUp: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    if (!account || !email || !name || !password) throw new Error('帳戶、暱稱、信箱和密碼不得為空！')
    if (password !== checkPassword) throw new Error('密碼不相符！')
    if (name.length > 50) throw new Error('超過暱稱字數上限 50 字！')
    return Promise.all([
      User.findOne({ where: { account } }),
      User.findOne({ where: { email } })
    ])
      .then(([user1, user2]) => {
        if (user1) throw new Error('account 已重複註冊！')
        if (user2) throw new Error('email 已重複註冊！')
        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({
        account,
        name,
        email,
        password: hash
      }))
      .then(newUser => {
        newUser = newUser.toJSON()
        delete newUser.password
        res.json({
          status: 'success',
          message: '成功註冊帳號！',
          ...newUser
        })
      })
      .catch(err => next(err))
  },
  getUser: (req, res, next) => {
    User.findByPk(req.params.id, {
      raw: true
    })
      .then(user => {
        if (!user) throw new Error('使用者不存在！')
        delete user.password
        delete user.role
        res.json({
          status: 'success',
          ...user
        })
      })
      .catch(err => next(err))
  },
  getCurrentUser: (req, res, next) => {
    User.findByPk(getUser(req).id, {
      raw: true
    })
      .then(user => {
        if (!user) throw new Error('使用者不存在！')
        delete user.password
        delete user.role
        res.json({
          status: 'success',
          ...user
        })
      })
      .catch(err => next(err))
  },
  putUserAccount: (req, res, next) => {
    const id = req.params.id
    if (Number(id) !== getUser(req).id) throw new Error('只能編輯本人帳戶資料！')
    const { account, name, email, password, checkPassword } = req.body
    if (!account || !email || !name) throw new Error('帳戶、暱稱和信箱不得為空！')
    if (password !== checkPassword) throw new Error('密碼不相符！')
    if (name.length > 50) throw new Error('超過暱稱字數上限 50 字！')
    Promise.all([
      User.findOne({ where: { account } }),
      User.findOne({ where: { email } })
    ])
      .then(([user1, user2]) => {
        if (user1) throw new Error('account 已存在！')
        if (user2) throw new Error('email 已存在！')
        return User.findByPk(req.params.id)
      })
      .then(user => {
        if (!user) throw new Error('使用者不存在！')
        return user.update({
          account,
          name,
          email,
          password: password ? bcrypt.hashSync(password, 10) : user.password
        })
      })
      .then(user => {
        user = user.toJSON()
        delete user.password
        delete user.role
        res.json({
          status: 'success',
          message: '成功編輯帳號！',
          ...user
        })
      })
      .catch(err => next(err))
  },
  // putUserProfile: (req, res, next) => {
  //   const id = req.params.id
  //   if (Number(id) !== getUser(req).id) throw new Error('只能編輯本人主頁資料！')
  //   const { name, introduction } = req.body
  //   const { avatar, cover } = req.files
  //   if (!name) throw new Error('帳戶不得為空！')
  //   if (name.length > 50) throw new Error('超過暱稱字數上限 50 字！')
  //   User.findByPk(req.params.id)
  //     .then(user => {
  //       if (!user) throw new Error('使用者不存在！')
  //       avatar = avatar ? avatar : user.avatar
  //       cover = cover ? cover : user.cover
  //       return user.update({
  //         name,
  //         introduction,
  //         avatar,
  //         cover
  //       })
  //     })
  //     .then(user => {
  //       res.json({
  //         status: 'success',
  //         message: '成功編輯個人主頁！',
  //         ...user
  //       })
  //     })
  //     .catch(err => next(err))
  // }
}
module.exports = userController

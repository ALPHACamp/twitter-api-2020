const { User } = require('../models')
const { Op } = require('sequelize')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signin: (req, res, next) => {
    try {
      const user = helpers.getUser(req).toJSON()
      // sign a token (payload + key)
      if (user?.role === 'admin') throw new Error('此帳號不存在')
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '30d' })
      delete user.password
      console.log(user)
      res.json({
        status: 'success',
        data:
          {
            token,
            user
          }
      })
    } catch (error) {
      next(error)
    }
  },
  signup: (req, res, next) => {
    const { name, email, password, checkPassword, account } = { ...req.body }
    if (!name || !email || !password || !checkPassword || !account) throw new Error('所有欄位皆須填寫')

    if (name.length > 50) throw new Error('名稱的字數超過上限 50 個字!')
    if (password !== checkPassword) throw new Error('密碼與重新輸入密碼不相符!')
    delete req.body.checkPassword
    return User.findOrCreate({
      where: {
        [Op.or]: [{ email: email }, { account: account }]
      },
      defaults: {
        ...req.body,
        password: bcrypt.hashSync(password, 10)
      }
    })
      .then(([user, created]) => {
        if (!created && user) {
          res.status(404).json({
            status: 'error',
            message: 'Error: account 已重複註冊、或 email 已重複註冊！',
            data: req.body
          })
        }

        res.status(200).json({
          status: 'success',
          message: '註冊成功、請先登入',
          data: user
        })
      })
      .catch(error => next(error))
  },
  getUser: (req, res, next) => {
    const id = Number(req.params.id)
    return User.findByPk(id, { raw: true })
      .then(user => {
        if (user?.role === 'admin') throw new Error('此帳號不存在')
        delete user.password
        res.status(200).json(user)
      })
      .catch(error => next(error))
  },
  putUser: (req, res, next) => {
    const UserId = req.params.id
    const { name, account, email, password, checkPassword, introduction } = req.body
    // setting page
    if (account || email || password) {
      if (!name || !account || !email || !password || !checkPassword) throw new Error('所有欄位皆須填寫')
      if (name.length > 50) throw new Error('名稱的字數超過上限 50 個字!')
      if (password !== checkPassword) throw new Error('密碼與重新輸入密碼不相符!')
      return Promise.all([
        User.findByPk(UserId),
        User.findOne({ where: { account } }),
        User.findOne({ where: { email } })
      ])
        .then(([user, userAccount, userEmail]) => {
          console.log(user.toJSON())
          const existedAccount = userAccount ? Number(userAccount.dataValues.id) : Number(UserId)
          const existedEmail = userEmail ? Number(userEmail.dataValues.id) : Number(UserId)
          if (user?.role === 'admin') throw new Error('此帳號不存在')
          if (existedAccount !== Number(UserId)) throw new Error('account 已存在')
          if (existedEmail !== Number(UserId)) throw new Error('email 已存在')
          return user.update({ name, account, email, password: bcrypt.hashSync(password, 10) })
            .then(editedData => res.status(200).json(editedData))
            .catch(error => next(error))
        })
        .catch(error => next(error))
    // user information page
    } else {
      if (!name || !introduction) throw new Error('名稱、自我介紹皆須填寫')
      if (name.length > 50) throw new Error('名稱的字數超過上限 50 個字!')
      if (introduction.length > 160) throw new Error('自我介紹的字數超過上限 160 個字!')
      const { file } = req
      const image = file?.image || null
      const backgroundImage = file?.backgroundImage || null
      return Promise.all([
        User.findByPk(UserId),
        imgurFileHandler(image),
        imgurFileHandler(backgroundImage)
      ])
        .then(([user, imageFilePath, backgroundFilePath]) => {
          if (!user) throw new Error('此帳號不存在')
          return user.update({ name, introduction, image: imageFilePath || user.image, backgroundImage: backgroundFilePath || user.backgroundImage })
            .then(user => res.status(200).json(user))
            .catch(error => next(error))
        })
        .catch(error => next(error))
    }
  }
}

module.exports = userController

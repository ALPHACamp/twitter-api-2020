const passport = require('passport')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')
const { User } = require('../models')
const { valueTrim } = require('../helpers/obj-helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signin: [
    passport.authenticate('local', {
      session: false
    }),
    (req, res, next) => {
      try {
        // 登入完後要發出jwt token
        const token = jwt.sign(helpers.getUser(req), process.env.JWT_SECRET, { expiresIn: '1d' }) // expiresIn: token的有效日期是一天
        res.status(200).json({
          token,
          user: helpers.getUser(req)
        })
      } catch (err) {
        next(err)
      }
    }
  ],
  signup: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = valueTrim(req.body)
      if (!account || !name || !email || !password || !checkPassword) throw new Error('所有欄位皆不可為空白')
      if (name.length > 50) throw new Error('名稱不可超過50字')
      if (password !== checkPassword) throw new Error('密碼與確認密碼不符')
      const [isAccountExist, isEmailExist] = await Promise.all([
        User.findOne({ where: { role: 'user', account }, attributes: ['id'] }),
        User.findOne({ where: { role: 'user', email }, attributes: ['id'] })
      ])
      if (isAccountExist) throw new Error('account 已重複註冊！')
      if (isEmailExist) throw new Error('email 已重複註冊！')
      const user = await User.create({
        role: 'user',
        account,
        name,
        email,
        password: bcrypt.hashSync(password, 10)
      })
      res.status(200).json(user)
    } catch (err) {
      next(err)
    }
  },
  getUser: async (req, res, next) => {
    try {
      const { id } = req.params
      const data = await User.findByPk(id, {
        attributes: { exclude: ['password', 'role'] },
        include: [
          { model: User, as: 'Followers', attributes: ['id'] },
          { model: User, as: 'Followings', attributes: ['id'] }
        ]
      })
      if (!data) throw new Error('查無此使用者')
      const signinUser = helpers.getUser(req)
      const user = {
        ...data.toJSON(),
        followers: data.Followers?.length,
        followings: data.Followings?.length,
        isMyself: helpers.getUser(req).id === Number(id),
        isFollowing: (signinUser.Followings) ? signinUser.Followings.some(following => following.id === Number(id)) : false
      }
      delete user.Followers
      delete user.Followings
      res.status(200).json(user)
    } catch (err) {
      next(err)
    }
  },
  editUserProfile: async (req, res, next) => {
    try {
      const signinUser = helpers.getUser(req)
      const { id } = req.params
      if (signinUser.id !== Number(id)) throw new Error('無編輯權限')
      const { name, introduction } = valueTrim(req.body)
      if (!name) throw new Error('名稱不可為空白')
      if (name.length > 50) throw new Error('名稱不可超過50字')
      if (introduction.length > 160) throw new Error('自我介紹不可超過160字')
      const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] }
      })
      if (!user) throw new Error('使用者不存在')

      const images = (!req.files) ? null : await imgurFileHandler(req.files) // 回傳為物件，{avatar: '...', cover: '...'}
      const editedUser = await user.update({
        name,
        introduction,
        avatar: images?.avatar ? images.avatar : user.toJSON().avatar,
        cover: images?.cover ? images.cover : user.toJSON().cover
      })
      res.status(200).json(editedUser)
    } catch (err) {
      next(err)
    }
  },
  editUserAccount: async (req, res, next) => {
    try {
      const signinUser = helpers.getUser(req)
      const { id } = req.params
      if (signinUser.id !== Number(id)) throw new Error('無編輯權限')
      const { account, name, email, password, checkPassword } = valueTrim(req.body)
      if (!account || !name || !email || !password || !checkPassword) throw new Error('所有欄位皆不可為空白')
      if (name.length > 50) throw new Error('名稱不可超過50字')
      if (password !== checkPassword) throw new Error('密碼與確認密碼不符')
      const [existAccount, existEmail, user] = await Promise.all([
        User.findOne({ where: { role: 'user', account }, attributes: ['id'], raw: true }),
        User.findOne({ where: { role: 'user', email }, attributes: ['id'], raw: true }),
        User.findByPk(id, { attributes: { exclude: ['password', 'role'] } })
      ])
      if (existAccount && existAccount.id !== Number(id)) throw new Error('account 已重複註冊！')
      if (existEmail && existEmail.id !== Number(id)) throw new Error('email 已重複註冊！')
      if (!user) throw new Error('使用者不存在')
      await user.update({
        account,
        name,
        email,
        password: bcrypt.hashSync(password, 10)
      })
      res.status(200).end()
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController

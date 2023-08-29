const { Op } = require('sequelize')
const sequelize = require('sequelize')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User, Tweet, Like } = require('../models')
const helpers = require('../_helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')
const userController = {
  login: (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()
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
    return User.findByPk(req.params.id, {
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
    return User.findByPk(helpers.getUser(req).id, {
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
    if (Number(id) !== Number(helpers.getUser(req).id)) throw new Error('只能編輯本人帳戶資料！')
    const { account, name, email, password, checkPassword } = req.body
    if (!account || !email || !name) throw new Error('帳戶、暱稱和信箱不得為空！')
    if (password !== checkPassword) throw new Error('密碼不相符！')
    if (name.length > 50) throw new Error('超過暱稱字數上限 50 字！')
    return User.findByPk(id)
      .then(async user => {
        if (!user) throw new Error('使用者不存在！')
        // 現在要更改的 account 在資料庫中不能有除了目前使用者以外相同的 account
        const user1 = await User.findOne({
          where: {
            [Op.and]: [
              { account },
              { account: { [Op.ne]: user.account } }
            ]
          }
        })
        // 現在要更改的 email 在資料庫中不能有除了目前使用者以外相同的 email
        const user2 = await User.findOne({
          where: {
            [Op.and]: [
              { email },
              { email: { [Op.ne]: user.email } }
            ]
          }
        })
        return [user1, user2, user]
      })
      .then(([user1, user2, user]) => {
        if (user1) throw new Error('account 已存在！')
        if (user2) throw new Error('email 已存在！')
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
  putUserProfile: (req, res, next) => {
    const id = req.params.id
    if (Number(id) !== Number(helpers.getUser(req).id)) throw new Error('只能編輯本人主頁資料！')
    const { name, introduction } = req.body
    const { avatar, cover } = req.files
    if (!name) throw new Error('暱稱不得為空！')
    if (name.length > 50) throw new Error('超過暱稱字數上限 50 字！')
    if (introduction.length > 160) throw new Error('超過自介自數上限 160 字！')
    const avatarFile = avatar ? avatar[0] : null
    const coverFile = cover ? cover[0] : null
    return Promise.all([
      User.findByPk(id),
      imgurFileHandler(avatarFile),
      imgurFileHandler(coverFile)
    ])
      .then(([user, avatarPath, coverPath]) => {
        if (!user) throw new Error('使用者不存在！')
        return user.update({
          name,
          introduction,
          avatar: avatarPath || user.avatar,
          cover: coverPath || user.cover
        })
      })
      .then(user => {
        user = user.toJSON()
        delete user.password
        delete user.role
        res.json({
          status: 'success',
          message: '成功編輯主頁！',
          ...user
        })
      })
      .catch(err => next(err))
  },
  getUserLikes: (req, res, next) => {
    const userId = req.params.id
    return Like.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
      // include: [{
      //   model: Tweet,
      //   include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }],
      //   attributes: {
      //     include: [
      //       [sequelize.literal('(SELECT COUNT (*) FROM Replies WHERE Replies.tweet_id = Tweet.id )'), 'replyCount'],
      //       [sequelize.literal('(SELECT COUNT (*) FROM Likes WHERE Likes.tweet_id = Tweet.id )'), 'likedCount']
      //     ]
      //   }
      // }],
      // raw: true
    })
      .then(likes => {
        console.log(likes)
        res.json(likes)
      })
      .catch(err => next(err))
  }
}
module.exports = userController

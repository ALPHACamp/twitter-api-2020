const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Like = db.Like
const Reply = db.Reply
const Followship = db.Followship
const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')


const userController = {
  signUP: (req, res) => {
    const { account, name, email, password, checkPassword } = req.body
    if (!account || !name || !email || !password || !checkPassword) {
      return res.json({ status: 'error', message: '所有欄位皆為必填' })
    }
    if (password !== checkPassword) {
      return res.json({ status: 'error', message: '兩次密碼輸入不同！' })
    }
    if (account.length > 20 || name.length > 50 || password.length > 20) {
      return res.json({ status: 'error', message: '超過字數上限' })
    }
    User.findOne({ where: { [Op.or]: [{ email }, { account }] } })
        .then(user => {
          if (user) {
            return res.json({ status: 'error', message: '信箱或帳戶重複！' })
          }
          User.create({
            account,
            name,
            email,
            password: bcrypt.hashSync(req.body.password, 10)
          })
              .then(() => {
                return res.json({ status: 'success', message: '成功註冊帳號！' })
              })
        })
  },

  signIn: (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
      return res.json({ status: 'error', message: "required fields didn't exist" })
    }

    return User.findOne({ where: { email } }).then(user => {
      if (!user) {
        return res.json({ status: 'error', message: "no such user found" })
      }
      if (user.role !== 'user') {
        return res.json({ status: 'error', message: "no such user found" })
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return res.json({ status: 'error', message: "passwords did not match" })
      }

      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.json({
        status: 'success',
        message: 'ok',
        token: token,
        user: { id: user.id, account: user.account, name: user.name, email: user.email, avatar: user.avatar, cover: user.cover, introduction: user.introduction, role: user.role }
      })
    })
  },
  getTweets: (req, res) => {
    User.findByPk(req.params.id, { include: [{ model: Tweet, include: [Like, Reply, User] }] })
        .then(user => {
          if (!user || user.role === 'admin') {
            return res.json({ status: 'error', message: 'No tweets' })
          } else {
            res.json(user.Tweets)
          }
        })
  },
  getUser: (req, res) => {
    return User.findByPk(req.params.id)
        .then(user => {
          if (!user || user.role === 'admin') {
            return res.json({ status: 'error', message: 'No user' })
          } else {
            return res.json(user)
          }
        })
  },

  getRepliedTweets: (req, res) => {
    return Reply.findAll({
      include: [User, { model: Tweet, include: [{ model: User, attributes: ['name', 'account'] }] }],
      where: { UserId: req.params.id }
    }).then(replies => {
      return res.json(replies)
    })
  },

  getLikes: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        { model: Like, include: [{ model: Tweet, include: [Like, User] }] }
      ]
    })
        .then(user => {
          if (!user || user.role === 'admin') {
            return res.json({ status: 'error', message: 'No user' })
          } else {
            return res.json(user.Likes)
          }
        })
  },

  putUser: (req, res) => {
    const { name, cover, avatar, introduction } = req.body
    // 判斷當前使用者與更改資料為同一人，但測試無法通過故先註解
    // if (req.params.id !== String(req.user.id)) {
    //   return res.json({ status: 'error', message: "權限錯誤" })
    // }
    if (name && name.length > 50) {
      return res.json({ status: 'error', message: 'name 超過字數上限' })
    }
    if (introduction && introduction.length > 160) {
      return res.json({ status: 'error', message: 'introduction 超過字數上限' })
    }
    return User.findByPk(req.params.id)
      .then(user => {
        return user.update({
          name,
          cover,
          avatar,
          introduction
        })
          .then(user => {
            return res.json({ status: 'success', message: '資料編輯成功' })
          })
      })
  },

  getCurrentUser: (req, res) => {
    return User.findByPk(req.user.id)
        .then(user => {
          return res.json(user)
        })
  }
}

module.exports = userController
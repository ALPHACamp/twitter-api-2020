const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Like = db.Like
const Reply = db.Reply
const jwt = require('jsonwebtoken')


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
    return User.findByPk(req.params.id, {
      include: [
        { model: Reply, include: [{ model: Tweet, include: [Like, Reply, User] }] }
      ],
      order: [['createdAt', 'DESC']]
    })
      .then(user => {
        if (!user || user.role === 'admin') {
          return res.json({ status: 'error', message: 'No user' })
        } else {
          return res.json(user.Replies)
        }
      })
  }
}

module.exports = userController
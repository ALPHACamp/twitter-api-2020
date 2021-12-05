const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')

const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Like = db.Like
const Reply = db.Reply

const adminController = {
  signIn: (req, res) => {
    const { account, password } = req.body
    if (!account || !password) {
      return res.json({ status: 'error', message: "所有欄位都是必填" })
    }

    User.findOne({
      where: {
        [Op.or]: [
          { account },
          { email: account }
        ]
      }
    }).then(user => {
      if (!user) {
        return res.json({ status: 'error', message: "帳號不存在" })
      }
      if (user.role !== 'admin') {
        return res.json({ status: 'error', message: "帳號不存在" })
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return res.json({ status: 'error', message: "密碼錯誤" })
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET)
      return res.json({
        status: 'success',
        message: 'ok',
        token: token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      })
    })
  },

  getTweets: (req, res) => {
    Tweet.findAll({
      include: [User],
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        tweets = tweets.map(t => ({
          ...t.dataValues,
          description: t.description.substring(0, 50)
        }))
        return res.json(tweets)
      })
  },

  deleteTweet: (req, res) => {
    Tweet.destroy({ where: { id: req.params.id } })
      .then(() => res.json({ status: 'success', message: '成功刪除推文' }))
  },

  getUsers: (req, res) => {
    User.findAll({
      include: [
        Like,
        Reply,
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' }
      ],
      order: [['name', 'ASC']]
    })
      .then(users => {
        users = users.filter(user => (
          !user.role.includes('admin')
        ))
        return res.json(users)
      })
  },

  getCurrentUser: (req, res) => {
    return User.findByPk(req.user.id)
      .then(user => {
        return res.json(user)
      })
  }
}

module.exports = adminController

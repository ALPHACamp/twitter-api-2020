const Sequelize = require('sequelize')
const Op = Sequelize.Op

const db = require('../../models')
const User = db.User
const helpers = require('../../_helpers');

const userController = {
  signUp: (req, res) => {
    // confirm password
    if (req.body.password !== req.body.checkPassword) {
      return res.json({ status: 'error', message: '密碼錯誤' })
    } else {
      // confirm unique user
      User.findOne({
        where: {
          [Op.or]: [
            { email: req.body.email },
            { account: req.body.account }
          ]
        }
      }).then(user => {
        if (user) {
          if (user.email === req.body.email) {
            return res.json({ status: 'error', message: 'Email 已重複註冊！' })
          }
          if (user.account === req.body.account) {
            return res.json({ status: 'error', message: '帳號已存在' })
          }
        } else {
          const userData = req.body
          User.create(userData)
            .then(user => {
              return res.status(200).json('Accept')
            })
        }
      })
        .catch(error => console.log(error))
    }
  },
  // editUser: (req, res) => {
  //   User.findByPk(req.params.id)
  //     .then(user => {
  //       return res.json({ user })
  //     })
  // },
  // editUserProfile: (req, res) => {
  //   User.findByPk(req.params.id)
  //     .then(user => {
  //       return res.json({ name: user.name, introduction: user.introduction })
  //     })
  // },
  putUser: (req, res) => {
    if (helpers.getUser(req).id !== Number(req.params.id)) {
      res.json({ status: 'error', message: "不能編輯他人的個人資料" })
      return res.redirect('back')
    }
    User.findByPk(req.params.id)
      .then(user => {
        user.update({
          account: req.body.account,
          name: req.body.name,
          email: req.body.email,
          introduction: req.body.introduction
        })
          .then((user) => {
            res.status(200).json('Accept')
          })
      })
      .catch(error => console.log(error))
  },
  // logout: (req, res) => {
  //   res.json({ status: 'success', message: 'Logout successful.' })
  //   req.logout()
  //   res.redirect('/signin')
  // }
}

module.exports = userController

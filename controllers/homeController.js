const db = require('../models')
const Op = db.Sequelize.Op
const User = db.User
const bcrypt = require('bcryptjs')
const issueJwt = require('../public/javascripts/tokenIssue')

const homeController = {
  logout: (req, res) => {
    res.clearCookie('jwt')
    res.redirect('/api/signin')
  },
  
  postSignIn: (req, res) => {
    // 檢查必要資料
    if (!req.body.email || !req.body.password) {
        return res.json({ status: 'error', message: "required fields didn't exist" })
      }
    // 檢查 user 是否存在與密碼是否正確
    let username = req.body.email
    let password = req.body.password

    User.findOne({ where: { email: username } }).then(user => {
      if (!user) return res.status(401).json({ status: 'error', message: 'no such user found' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: 'passwords did not match' })
      }
      // 簽發 token
      console.log("🚀 ~ file: homeController.js ~ line 43 ~ User.findOne ~ user", user)
      const tokenInfo = issueJwt(user)
      return res.json({
        status: 'success',
        message: 'ok',
        token: tokenInfo,
        user: {
          id: user.id, name: user.name, avatar: user.avatar, role: user.role
        }
      })
    })
  },

  postSignUp: (req, res) => {
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
}

module.exports = homeController
const db = require('../models')
const User = db.User
const bcrypt = require('bcryptjs')
const issueJwt = require('../public/javascripts/tokenIssue')
const userDataValidate = require('../public/javascripts/userDataValidate')

const homeController = {
  
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
  
  postSignUp: async (req, res) => {
    const userData = req.body

    // if (!userDataValidate(userData)) {
    //   return res.status(400).json('data invalid')
    // }
    // 確認account及email是否已被註冊
    if (userData.email) {
      const isUser = await User.findOne({
        where: { email: userData.email },
        attributes: ['email'],
      })
      if (isUser !== null) return res.status(400).json('Email已被使用')
    }
    if (userData.account) {
      const isUser = await User.findOne({
        where: { account: userData.account },
        attributes: ['account'],
      })
      if (isUser !== null) return res.status(400).json('account已被使用')
    }
    // 確認password是否一致
    if (userData.password !== userData.checkPassword) {
      return res.status(400).json('password不一致')
    }

    const salt = await bcrypt.genSalt(10)
    userData.password = await bcrypt.hash(userData.password, salt)

    try {
      const user = await User.create(userData)
      if (user) {
        res.status(200).json('Accept')
      } else {
        res.status(400)
      }
    }
    catch (error) {
      res.status(400)
    }
  }
}

module.exports = homeController
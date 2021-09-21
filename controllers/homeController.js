const db = require('../models')
const User = db.User
const bcrypt = require('bcryptjs')
const issueJwt = require('../public/javascripts/tokenIssue')

const homeController = {
  signUp: (req, res) => {
    res.render('signup')
  },

  signIn: (req, res) => {
    res.render('signin')
  },
  
  signInAdmin: (req, res) => {
    res.render('signinAdmin')
  },
  
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
      if (user.role === 'admin') return res.status(401).json({ status: 'error', message: 'admin 不可登入前台' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: 'passwords did not match' })
      }
      // 簽發 token
      const tokenInfo = issueJwt(user)
      const allInfo = {
          token: tokenInfo.token,
          userId: user.id,
        }
      res.cookie('jwt', allInfo, { httpOnly: true, expireIn: '3h' })
      res.redirect('/api/admin')
    })
  },
  
  postSignUp: async (req, res) => {
    const userData = req.body
    if (req.body.checkPassword !== req.body.password) {
      return res.redirect('/signup')
    }
    try {
      const user = await User.create(userData)
      if (user) {
        res.status(200).json('Accept')
      } else {
        res.status(400)
      }
    }
    catch (error) {
      console.log(error)
    }
  }
}

module.exports = homeController
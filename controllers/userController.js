const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy


const userController = {
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res) => {
    const { account, email, password, passwordCheck } = req.body
    if (account && email && password && passwordCheck) {
      // confirm password
      if (req.body.passwordCheck !== req.body.password) {
        console.log('兩次密碼輸入不同！')
        return res.redirect('back')
      } else {
        // confirm unique user
        User.findOne({ where: { email: req.body.email } }).then(user => {
          if (user) {
            req.flash('error_messages', '信箱重複！')
            return res.redirect('/signup')
          } else {
            User.create({
              account: account,
              email: email,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
            }).then(user => {
              console.log('成功註冊帳號！')
              return res.redirect('/signin')
            })
          }
        })
      }
    } else {
      console.log('全部欄位都要輸入')
      return res.redirect('back')
    }

  },
  signIn: (req, res) => {
    const { account, password } = req.body
    console.log(req.body)
    // 檢查必要資料
    if (!account || !password) {
      console.log('請入資訊')
      return res.redirect('back')
    }
    User.findOne({
      where: {
        account: account,
      }
    })
      .then(user => {
        console.log('step1')
        if (!user) {
          console.log('沒有此帳戶')
          return res.redirect('back')
        }
        console.log('step2')
        if (!bcrypt.compareSync(password, user.password)) {
          console.log('密碼錯誤')
          return res.redirect('back')
        }
        // 簽發 token
        const payload = { id: user.id }
        const token = jwt.sign(payload, process.env.JWT_SECRET)
        console.log('step3')
        res.json({
          status: 'success',
          message: 'ok',
          token: token,
          user: {
            id: user.id, account: user.account, email: user.email
          }
        })
      })
  },
  logout: (req, res) => {
    console.log('登出成功！')
    req.logout()
    res.redirect('/signin')
  }
}
module.exports = userController
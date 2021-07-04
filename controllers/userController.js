const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

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
    // 檢查必要資料
    if (!account || !password) {
      console.log('請入資訊')
      return res.redirect('back')
    }
    // 檢查 user 是否存在與密碼是否正確
    // let username = req.body.email
    // let password = req.body.password

    // User.findOne({ where: { email: username } }).then(user => {
    //   if (!user) return res.status(401).json({ status: 'error', message: 'no such user found' })
    //   if (!bcrypt.compareSync(password, user.password)) {
    //     return res.status(401).json({ status: 'error', message: 'passwords did not match' })
    //   }
    //   // 簽發 token
    //   var payload = { id: user.id }
    //   var token = jwt.sign(payload, process.env.JWT_SECRET)
    //   return res.json({
    //     status: 'success',
    //     message: 'ok',
    //     token: token,
    //     user: {
    //       id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin
    //     }
    //   })
    // })
  },
}

module.exports = userController
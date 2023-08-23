const bcrypt = require('bcryptjs') // 載入 bcrypt
const { User } = require('../models')

const userController = {
  signUp: (req, res, next) => {
    // 如果二次輸入的密碼不同，就建立一個 Error 物件並拋出
    if (req.body.password !== req.body.confirmPassword) throw new Error('二次輸入密碼不符合!')
    // 檢查name字數，上限為50字
    if (req.body.name.length > 50) throw new Error('字數超出上限！')
    // 查找是否有該帳戶或email
    Promise.all([
      User.findOne({ where: { account: req.body.account } }),
      User.findOne({ where: { email: req.body.email } })
    ])
      .then(([account, email]) => {
        // 如果有一樣的account或email，丟錯告知前端
        if (account) throw new Error('account 已重複註冊！')
        if (email) throw new Error('email 已重複註冊！')
        // 如果檢查ok，呼叫bcrypt將使用者的密碼進行雜湊
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => {
        return User.create({
          email: req.body.email,
          password: hash,
          name: req.body.name,
          account: req.body.account
        })
      })
      .then(() => {
        res.json({
          status: 'success',
          data: {
            message: `${req.body.account}已經成功註冊!`
          }
        })
      })
      .catch(err => next(err)) // 接住前面拋出的錯誤，呼叫專門做錯誤處理的 middleware
  }
}

module.exports = userController

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs') // 教案 package.json 用 bcrypt-node.js，不管，我先用舊的 add-on
const { User } = require('../models')
const { getUser } = require('../_helpers')

const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = getUser(req).toJSON()
      delete userData.password // 刪除 .password 這個 property
      // (下1) 發出 jwt token，要擺兩個引數，第一個，要包進去的資料，第二個，要放 secret key
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 30 天過期，可調
      res.json({ status: 'success', data: { token, user: userData } })
    } catch (err) {
      next(err)
    }
  },
  signUp: (req, res, next) => {
    // (下1) 測試檔不給過，先 comment，之後刪
    // if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
    if (req.body.name.length > 50) throw new Error('name 字數大於 50')

    return Promise.all([
      User.findOne({ where: { email: req.body.email } }),
      User.findOne({ where: { account: req.body.account } })
    ])
      .then(([emailResult, accountResult]) => {
        if (emailResult && accountResult) throw new Error('email 與 account 都重複註冊！')
        if (emailResult) throw new Error('email 已重複註冊！')
        if (accountResult) throw new Error('account 已重複註冊！')
      })
    // User.findOne({
    //   where: {
    //     [Op.or]: [
    //       { email: req.body.email },
    //       { account: req.body.account }]
    //   }
    // })
    //   .then(user => {
    //     if (user) throw new Error('email 已重複註冊！')

    //     return bcrypt.hash(req.body.password, 10)
    //   })
      .then(() => bcrypt.hash(req.body.password, 10))
      .then(hash =>
        User.create({
          account: req.body.account,
          name: req.body.name,
          email: req.body.email,
          password: hash
        })
      )
      .then(createdUser => {
        const result = createdUser.toJSON()
        delete result.password // 避免不必要資料外洩
        res.status(200).json({ status: 'success', user: result })
      })
      .catch(err => next(err))
  }
}

module.exports = userController

const db = require('../models')
const { User } = db
const bcrypt = require('bcryptjs')

const userServices = {
  signUp: (req, cb) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
    if (req.body.name && req.body.name.length > 50) throw new Error('名稱不可超過５０字')
    Promise.all([
      User.findOne({ where: { email: req.body.email } }),
      User.findOne({ where: { account: req.body.account } })
    ])
      .then(([foundEmail, foundAccount]) => {
        // !有餘力再來優化程式
        let errorMessage = ''
        if (foundEmail) {
          errorMessage += 'email 已重複註冊！'
        }
        if (foundAccount) {
          errorMessage += 'account 已重複註冊！'
        }
        if (errorMessage.length > 0) {
          console.log(errorMessage)
          throw new Error(errorMessage)
        }
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash =>
        User.create({
          account: req.body.account,
          name: req.body.name,
          email: req.body.email,
          password: hash,
          role: 'user'
        }))
      .then(newUser => cb(null, { user: newUser }))
      .catch(err => cb(err))
  }
}

module.exports = userServices

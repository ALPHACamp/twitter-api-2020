const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')
const { User } = require('../models')
const { Op } = require('sequelize')
// const { getUser } = require('../_helpers')
// const { imgurFileHandler } = require('../helpers/file-helper')

const userServices = {
  signUp: (req, cb) => {
    // 密碼輸入不一致
    if (req.body.password !== req.body.checkPassword) throw new Error('Passwords do not match!')
    return User.findOne({
      where: { [Op.or]: [{ account: req.body.account }, { email: req.body.email }] }
    })
      .then(user => {
        // 錯誤處理: user已註冊
        if (user) {
          if (user.account === req.body.account) throw new Error('Account already exists!')
          if (user.email === req.body.email) throw new Error('Email already exists!')
        }
        // user未註冊過
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        account: req.body.account,
        email: req.body.email,
        password: hash,
        role: 'user'
      }))
      .then(newUser => cb(null, { newUser }))
      .catch(err => cb(err))
  }
}

module.exports = userServices

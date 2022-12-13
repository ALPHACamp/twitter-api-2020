const { User, Like, Favorite, Tweet } = require('./../models')
const jwt = require('jsonwebtoken')
const { imgurFileHandler } = require('../helpers/file-helpers')
const bcrypt = require('bcryptjs')
const userServices = {
  loginUser: (req, cb) => {
    try {
      delete req.user.password
      const userData = req.user.toJSON()
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      cb(null, {
        token,
        user: userData
      })
    } catch (err) {
      cb(err)
    }
  },
  getUsers: (req, cb) => {
    return User.findAll({
      raw: true,
      nest: true
    })
      .then(users => cb(null, { users }))
      .catch(err => cb(err))
  },
  registerUser: (req, cb) => {
    // password check
    if (req.body.password !== req.body.checkPassword) throw new Error('Passwords do not match!')
    // account and email check
    Promise.all([
      User.findOne({ where: { account: req.body.account } }), User.findOne({ where: { email: req.body.email } })
    ])
      .then(([userWithAccount, userWithEmail]) => {
        if (userWithAccount) throw new Error('Account already exists!')
        if (userWithEmail) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        account: req.body.account,
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(user => {
        delete user.password
        return cb(null, {
          user
        })
      })
      .catch(err => cb(err))
  },
  editUser: (req, cb) => {
    const { account, name, email, introduction, password, avatar, cover } = req.body // pending name of User cover
    return Promise.all([ // Check if account and email are unique
      User.findOne({ where: { account } }),
      User.findOne({ where: { email } })
    ])
      .then(([UserWithAccount, UserWithEmail]) => {
        if (UserWithAccount) throw new Error('account already exists!')
        if (UserWithEmail) throw new Error('email already exists!')
        const { file } = req
        imgurFileHandler(file)
          .then(filePath => User.update({
            account,
            name,
            email,
            introduction,
            password,
            avatar: filePath,
            cover
          }))
      })
      .then(updatedUser => {
        cb(null, { restaurant: updatedUser })
      })
      .catch(err => cb(err))
  }
}
module.exports = userServices

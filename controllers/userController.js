const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJWT = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
const moment = require('moment')

const db = require('../models')
const { User, Tweet, Reply, Like } = db

const userController = {
  register: (req, res) => {
    const { account, name, email, password, passwordConfirm } = req.body
    const errors = []
    if (!account && !name && !email && !password && !passwordConfirm) {
      errors.push({ status: 'error', message: 'all columns are empty' })
    } else if (!account) {
      errors.push({ status: 'error', message: 'account is empty' })
    } else if (!name) {
      errors.push({ status: 'error', message: 'name is empty' })
    } else if (!email) {
      errors.push({ status: 'error', message: 'email is empty' })
    } else if (!password) {
      errors.push({ status: 'error', message: 'password is empty' })
    } else if (!passwordConfirm) {
      errors.push({ status: 'error', message: 'passwordConfirm is empty' })
    } else if (password !== passwordConfirm) {
      errors.push({ status: 'error', message: 'password or passwordConfirm is incorrect' })
    }
    if (errors.length) return res.json(...errors);

    User.findOne({ where: { account } })
      .then(userOwnedAccount => {
        if (userOwnedAccount) {
          return res.json({ status: 'error', message: 'this account is registered' })
        }
        User.findOne({ where: { email } })
          .then(userOwnedEmail => {
            if (userOwnedEmail) {
              return res.json({ status: 'error', message: 'this email is registered' })
            }
            return User.create({
              account,
              name,
              email,
              password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
              role: 'user'
            })
          })
          .then(() => res.json({ status: 'success', message: 'register successfully' }))
          .catch(err => console.log(err))
      }).catch(err => console.log(err))
  },

  login: (req, res) => {
    // check input
    const { account, password } = req.body
    const errors = []
    if (!account && !password) {
      errors.push({ status: 'error', message: 'all columns are empty' })
    } else if (!account) {
      errors.push({ status: 'error', message: 'account is empty' })
    } else if (!password) {
      errors.push({ status: 'error', message: 'password is empty' })
    }
    if (errors.length) return res.json(...errors);

    // check user login info
    User.findOne({ where: { account } })
      .then(user => {
        if (!user) return res.json({ status: 'error', message: `can not find user "${user}"` })
        if (!bcrypt.compareSync(password, user.password)) {
          return res.json({ status: 'error', message: 'account or password is incorrect' })
        }

        const payload = { id: user.id }
        const token = jwt.sign(payload, process.env.JWT_SECRET)
        return res.json({
          status: 'success',
          message: 'ok',
          token,
          user: {
            id: user.id,
            account: user.account,
            name: user.name,
            email: user.email,
            role: user.role
          }
        })
      })
  },
  
  getUser: (req, res) => {
    return User.findByPk(req.params.id, {
      order: [
        [{ model: Tweet }, 'createdAt', 'DESC']
        [{ model: Reply }, 'createdAt', 'DESC'],
        [{ model: Like }, 'createdAt', 'DESC'],
      ],
      include: [
        { model: Tweet, include: [Like, Reply] },
        { model: Reply, include: [Tweet] },
        { model: Like, include: [Tweet] },
      ]
    }).then(user => {
      return res.json({
        user: user,
        tweetCounts: user.Tweets.length,
      })
    })
  },

}
module.exports = userController
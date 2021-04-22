const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const db = require('../models')
const User = db.User

module.exports = {
  login: (req, res) => {
    const { account, password } = req.body
    // validate user input
    if (!account || !password) {
      return res.status(400).json({ status: 'error', message: "Required fields didn't exist." })
    }
    // validate account and password
    User.findOne({ where: { account } }).then(user => {
      if (!user) return res.status(400).json({ status: 'error', message: 'Account does not exist.' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(400).json({ status: 'error', message: 'Passwords does not match.' })
      }
      if (user.role === 'admin') {
        return res.status(403).json({ status: 'error', message: 'User only. Administrator permission denied.' })
      }
      // issue a token
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' })
      return res.status(200).json({
        status: 'success',
        message: 'ok',
        token: token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          introduction: user.introduction,
          role: user.role,
          account: user.account,
          cover: user.cover,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      })
    })
      .catch(error => {
        const data = { status: 'error', message: error.toString() }
        console.log(error)
        return res.status(500).json(data)
      })
  },

  register: (req, res) => {
    const { email, password, name, account, checkPassword } = req.body

    const message = []

    // all input required
    if (!email || !password || !name || !account || !checkPassword) {
      message.push('Please complete all fields')
    }
    // check password
    if (checkPassword !== password) {
      message.push('Password does not match')
    }
    // check email
    if (!validator.isEmail(`${email}`)) {
      message.push('Invalid email address')
    }
    // check name length <= 25
    if (!validator.isByteLength(`${name}`, { min: 1, max: 25 })) {
      message.push('The name field can have no more than 25 characters')
    }
    // check email length <= 255
    if (!validator.isByteLength(`${email}`, { min: 1, max: 255 })) {
      message.push('The email field can have no more than 255 characters')
    }
    // check account length <= 255
    if (!validator.isByteLength(`${account}`, { min: 1, max: 255 })) {
      message.push('The account field can have no more than 255 characters')
    }
    // check password length <=255
    if (!validator.isByteLength(`${password}`, { min: 1, max: 255 })) {
      message.push('The password field can have no more than 255 characters')
    }
    if (message.length !== 0) {
      return res.status(400).json({ status: 'error', message })
    }

    // check if account and email used already
    User.findOne({ where: { account: account } })
      .then(user => {
        if (user) {
          message.push('Account already exist')
        }
        User.findOne({ where: { email: email } })
          .then(user => {
            if (user) {
              message.push('Email alreay exist')
            }
            if (message.length !== 0) {
              return res.status(400).json({ status: 'error', message })
            } else {
              User.create({
                email: email,
                password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
                name: name,
                account: account
              })
                .then(newUser => {
                  return res.status(201).json({ status: 'success', message: 'Registered' })
                })
            }
          })
      })
  }
}

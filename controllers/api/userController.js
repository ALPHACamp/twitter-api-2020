const db = require('../../models')
const User = db.User
const bcrypt = require('bcryptjs')

//JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const userController = {
  signUp: (req, res) => {
    if (req.body.checkPassword !== req.body.password) {
      return res.json({ status: 'error', message: 'Password is different' })
    } else {
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          return res.json({ status: 'error', message: 'Email is already exists' })
        } else {
          User.create({
            account: req.body.account,
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            return res.json({ status: 'success', message: 'User was successfully registered' })
          })
        }
      })
    }
  },
  signIn: (req, res) => {
    if (!req.body.email || !req.body.password) {
      return res.json({ status: 'error', message: "required fields didn't exist" })
    }

    const { email, password } = req.body
    User.findOne({ where: { email: email } }).then(user => {
      if (!user) return res.status(401).json({ status: 'error', message: "user not found" })
      if (!bcrypt.compareSync(password, user.password)) return res.status(401).json({ status: 'error', message: "password is not correct" })
      //簽發token
      const payload = { id: user.id }
      const token = jwt.sign(payload, 'twitterKiller') //之後寫入dotenv
      return res.json({
        status: 'success',
        message: 'ok',
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      })
    })
  },
  getUsers: (req, res) => { },
  getUser: (req, res) => { },
  getUserTweets: (req, res) => { },
  getUserReplies: (req, res) => { },
  getUserLikes: (req, res) => { },
  getFollowings: (req, res) => { },
  getFollowers: (req, res) => { },
  putUser: (req, res) => { },
  editUser: (req, res) => { }
}

module.exports = userController
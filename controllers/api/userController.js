const db = require('../../models')
const User = db.User
const bcrypt = require('bcryptjs')
const userService = require('../../services/userService')

//JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const userController = {
  signUp: (req, res) => {
    userService.signUp(req, res, (data) => {
      console.log(data)
      return res.json(data)
    })
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
  getTopUser: (req, res) => {
    userService.getTopUser(req, res, (data) => {
      return res.json(data)
    })
  },
  getUser: (req, res) => {
    userService.getUser(req, res, (data) => {
      return res.json(data)
    })
  },
  editUser: (req, res) => {
    userService.editUser(req, res, (data) => {
      return res.json(data)
    })
  },
  putUser: (req, res) => { },
  getUserTweets: (req, res) => {
    userService.getUserTweets(req, res, (data) => {
      return res.json(data)
    })
  },
  getUserReplies: (req, res) => {
    userService.getUserReplies(req, res, (data) => {
      return res.json(data)
    })
  },
  getUserLikes: (req, res) => { },
  getFollowings: (req, res) => { },
  getFollowers: (req, res) => { }
}

module.exports = userController
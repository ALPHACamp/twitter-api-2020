const adminService = require('../services/adminServices.js')
const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const sequelize = require('sequelize')
// JWT
const jwt = require('jsonwebtoken')

const adminController = {
  signIn: (req, res) => {
    if (!req.body.email || !req.body.password) {
      return res.json({ status: 'error', message: "required fields didn't exist" })
    }
    let email = req.body.email
    let password = req.body.password

    User.findOne({
      where: { email: email }
    }).then(user => {
      if (!user) return res.status(401).json({ status: 'error', message: 'no such user found' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: 'passwords did not match' })
      }
      if (user.role === 'admin') {
        var payload = { id: user.id }
        var token = jwt.sign(payload, 'alphacamp')
        return res.json({
          status: 'success',
          message: 'ok',
          token: token,
          user: {
            id: user.id, account: user.account, name: user.name, email: user.email, role: user.role, avatar: user.avatar, introduction: user.introduction
          }
        })
      } else {
        return res.json({ status: 'error', message: 'Permission denied' })
      }
    })
  },
  getTweets: (req, res) => {
    adminService.getTweets(req, res, (data) => {
      return res.json(data)
    })
  },
  getUsers: (req, res) => {
    adminService.getUsers(req, res, (data) => {
      return res.json(data)
    })
  },
  deleteTweet: (req, res) => {
    adminService.deleteTweet(req, res, (data) => {
      return res.json(data)
    })
  }
}
module.exports = adminController

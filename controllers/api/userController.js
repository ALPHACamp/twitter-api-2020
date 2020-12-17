const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt-nodejs')
const db = require('../../models')
const { Op } = require('sequelize')
const User = db.User

const userController = {
  signUp: async (req, res) => {
    try {
      const { account, name, email, password, passwordCheck } = req.body
      if (!account || !name || !email || !password) {
        return res.json({ status: 'error', message: "Required fields didn't exist." })
      }
      if (password !== passwordCheck) {
        return res.json({ status: 'error', message: "Passwords didn't match." })
      }
      const users = await User.findAll({ raw: true, where: { [Op.or]: [{ email }, { account }] } })
      if (users.length) {
        return users.forEach((user) => {
          if (user.account === account && user.email === email) {
            return res.json({ status: 'error', message: 'This email and account are already in use.' })
          } else if (user.account === account) {
            return res.json({ status: 'error', message: 'This account is already in use.' })
          } else if (user.email === email) {
            return res.json({ status: 'error', message: 'This email is already in use.' })
          }
        })
      }
      await User.create({
        account,
        name,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
      })
      res.json({ status: 'success', message: 'ok' })
    } catch (error) {
      console.log(error)
    }
  },
  signIn: async (req, res) => {
    try {
      const { email, password } = req.body
      if (!email || !password) {
        return res.json({ status: 'error', message: "Required fields didn't exist." })
      }
      const user = await User.findOne({ where: { email } })
      if (!user) {
        return res.status(401).json({ status: 'error', message: 'No such user found.' })
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: "Password didn't match." })
      }

      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      res.json({
        status: 'success',
        message: 'ok',
        token,
        user
      })
    } catch (error) {
      console.log(error)
    }
  },
  getUser: (req, res) => {

  },
  getCurrentUser: (req, res) => {

  },
  updateUser: (req, res) => {

  },
  getTopUsers: (req, res) => {

  },
  getTweets: (req, res) => {

  },
  getRepliedTweets: (req, res) => {

  },
  getLikedTweets: (req, res) => {

  },
  getFollowings: (req, res) => {

  },
  getFollowers: (req, res) => {

  },
  addFollowing: (req, res) => {

  },
  removeFollowing: (req, res) => {

  }
}

module.exports = userController

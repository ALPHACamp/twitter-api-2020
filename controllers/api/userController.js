const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt-nodejs')
const db = require('../../models')
const User = db.User

const userController = {
  signUp: (req, res) => {

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

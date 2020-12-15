const db = require('../../models')
const User = db.User
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const adminController = {

  signIn: async (req, res, next) => {
    try {
      const { account, password } = req.body
      const user = await User.findOne({ where: { account: account }, raw: true })

      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(403).json({
          status: 'error',
          message: 'Invalid email or password.'
        })
      }

      return res.json({
        status: 'success',
        message: `Successfully login. Welcome ${user.role} ${user.name}.`,
        token: jwt.sign({ id: user.id }, process.env.JWT_SECRET),
      })

    } catch (error) {
      next(error)
    }
  },

  getTweets: async (req, res, next) => { },

  deleteTweet: async (req, res, next) => { },

  getUsers: async (req, res, next) => { },

}

module.exports = adminController
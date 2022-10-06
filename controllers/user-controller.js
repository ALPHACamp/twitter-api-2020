const jwt = require('jsonwebtoken')
const { User } = require('../models')

const userController = {
  signIn: (req, res, next) => {
    try {
      // if (req.user.role.include('admin')) throw new Error("This account didn't exist！")

      const userData = req.user.toJSON()
      console.log(userData)
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error("passport didn't ")
  },
  getUser: (req, res, next) => {
    User.findOne({ 
      account: "root",
      raw: true
   })
    .then(user => console.log(user))
    .catch(err => next(err))
  }
}

module.exports = userController

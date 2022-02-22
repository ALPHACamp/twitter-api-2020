const { User } = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userServices = {
  signUp: (req, cb) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
    return Promise.all([
      User.findOne({ where: { email: req.body.email } }),
      User.findOne({ where: { account: req.body.account } })
    ])
      .then(([email, account]) => {
        if (email) throw new Error('Email already exists!')
        if (account) throw new Error('Account already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then((createdUser) => {
        createdUser = createdUser.toJSON()
        delete createdUser.password
        return cb(null, { user: createdUser })
      })
      .catch(err => cb(err))
  },
  signIn: async (req, cb) => {
    try {
      let result = {}
      const { account, password } = req.body
      if (!account || !password) {
        throw new Error('All fields are required!')
      }
      const user = await User.findOne({ where: { account } })
      if (!user) {
        throw new Error('User not found!')
      } else if (!bcrypt.compareSync(password, user.password)) {
        throw new Error('Incorrect Account or Password!')
      } else {
        result = user.toJSON()
      }
      if(result){
        const payload = { id: user.id }
        const token = jwt.sign(payload, process.env.JWT_SECRET)
        delete result.password
        return cb(null, { token , user:result })
      }
    } catch (err) {
      return cb(err)
    }
  },
}
module.exports = userServices
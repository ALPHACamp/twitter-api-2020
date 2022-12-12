const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const assert = require('assert')

const userServices = {
  signUp: (req, cb) => {
    const { account, name, email, password, passwordCheck } = req.body
    if (password !== passwordCheck) throw new Error('Password do not match!')
    Promise.all([
      User.findOne({ where: { account } }),
      User.findOne({ where: { email } })
    ])
      .then(([userFindByAccount, userFindByEmail]) => {
        assert(userFindByAccount, 'The account already exist.')
        assert(userFindByEmail, 'The Email already exist.')
        return bcrypt.hash(password, 10)
      })
      .then(hash => {
        return User.create({
          account,
          name,
          email,
          password: hash
        })
      })
      .then(createdUser => cb(null, createdUser))
      .catch(err => cb(err))
  },
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
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
  }
}


module.exports = userServices

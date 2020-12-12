const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const helpers = require('../../_helpers.js')
const { User, sequelize } = require('../../models')
const { Op } = sequelize
const userController = {
  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      //check user input
      if (!account || !name || !email || !password || !checkPassword) return res.json({
        status: 'error',
        message: 'All fields are required. Some are missing.'
      })
      if (password !== checkPassword) return res.json({
        status: 'error',
        message: 'Password and checkPassword don\'t match.'
      })

      //check if email or account is already registered
      let user = await User.findAll({
        where: {
          [Op.or]: [
            { email: { [Op.eq]: email } },
            { account: { [Op.eq]: account } }
          ]
        }
      }, { raw: true })

      if (user.length > 1 ||
        (user.length === 1 && user[0].email === email && user[0].account === account)) {
        return res.json({
          status: 'error',
          message: 'The account and email have already been registered.'
        })
      } else if (user.length === 1) {
        user = user[0]
        console.log('@@user.length === 1')
        if (user.email === email) {
          console.log('@@ user.email === email')
          return res.json({
            status: 'error',
            message: 'The email has already been registered.'
          })
        } else {
          console.log('@@ user.email !== email')
          return res.json({
            status: 'error',
            message: 'The account has already been registered.'
          })
        }
      }

      //After check, create new user
      await User.create({
        account, name, email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      })
      return res.json({
        status: 'success',
        message: 'Successfully sign up.'
      })
    } catch (error) {
      next(error)
    }
  },
}
module.exports = userController
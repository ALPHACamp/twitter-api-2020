const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const helpers = require('../../_helpers.js')
const { User, Sequelize, sequelize } = require('../../models')
const { Op } = Sequelize

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
        if (user.email === email) {
          return res.json({
            status: 'error',
            message: 'The email has already been registered.'
          })
        } else {
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
  signIn: async (req, res, next) => {
    try {
      const { email, password } = req.body
      if (!email || !password) return res.json({
        status: 'error',
        message: 'Email and password fields are required'
      })
      const user = await User.findOne({ where: { email }, raw: true })
      if (!user) return res.json({
        status: 'error',
        message: 'The email has not been registered.'
      })
      if (!bcrypt.compareSync(password, user.password)) return res.json({
        status: 'error',
        message: 'Wrong email or password.'
      })
      return res.json({
        status: 'success',
        message: 'Successfully login',
        token: jwt.sign({ id: user.id }, process.env.JWT_SECRET),
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      })
    } catch (error) {
      next(error)
    }
  },
  getUser: async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      if (!id) return res.json({ status: 'error', message: 'Invalid user id.' })
      let user = await User.findByPk(id, {
        attributes: {
          include: [
            [sequelize.literal(`(SELECT Count(*) FROM Followships AS f WHERE f.followerId=${id})`), 'FollowingsCount'],
            [sequelize.literal(`(SELECT Count(*) FROM Followships AS f WHERE f.followingId=${id})`), 'FollowersCount']
          ]
        },
        include: { model: User, as: 'Followings' }
      })
      if (!user) return res.json({ status: 'error', message: 'Invalid user id.' })
      user = user.toJSON()
      user.isFollowed = helpers.getUser(req).Followings.includes(user.id)
      return res.json({ status: 'success', ...user })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = userController
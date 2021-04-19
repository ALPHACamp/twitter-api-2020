const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

const helpers = require('../_helpers')
const { sequelize } = require('../models')

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const userController = {
  login: async (req, res) => {
    // Make sure all the fields are filled out
    if (!req.body.account || !req.body.password) {
      return res.json({
        status: 'error',
        message: 'All fields are required.'
      })
    }

    // Check email and password
    const account = req.body.account
    const password = req.body.password

    const user = await User.findOne({ where: { account } })

    if (!user) {
      return res
        .status(401)
        .json({ status: 'error', message: 'That email is not registered.' })
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res
        .status(401)
        .json({ status: 'error', message: 'Incorrect Password' })
    }

    // Sign token
    const payload = { id: user.id }
    const token = jwt.sign(payload, process.env.JWT_SECRET)
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
  },
  register: async (req, res) => {
    const { account, name, email, password, checkPassword } = req.body
    const emailRule = /^\w+((-\w+)|(\.\w+)|(\+\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
    const errors = []

    // Before creating an account,
    // make sure all the required fields are correct
    if (!account || !name || !email || !password || !checkPassword) {
      errors.push({ message: 'Please fill out all fields.' })
    }
    if (email.search(emailRule) === -1) {
      errors.push({ message: 'Please enter the correct email address.' })
    }
    if (password !== checkPassword) {
      errors.push({ message: 'Password and checkPassword do not match.' })
    }
    if (errors.length > 0) {
      return res.json({ status: 'error', errors })
    }

    try {
      // make sure email amd account has not been used yet
      let user = await User.findOne({ where: { email } })

      if (user) {
        return res.json({
          status: 'error',
          message: `A user with ${email} already exists. Choose a different address or login directly.`
        })
      }

      user = await User.findOne({ where: { account } })

      if (user) {
        return res.json({
          status: 'error',
          message: `A user with account '${account}' already exists. Choose a different account or login directly.`
        })
      }

      await User.create({
        account,
        name,
        email,
        password: bcrypt.hashSync(
          req.body.password,
          bcrypt.genSaltSync(10),
          null
        ),
        role: false,
        avatar: 'https://i.imgur.com/q6bwDGO.png',
        cover: 'https://i.imgur.com/1jDf2Me.png'
      })

      return res.status(200).json({
        status: 'success',
        message: `${req.body.account} register successfully! Please login.`
      })
    } catch (error) {
      console.log(error)
    }
  },
  getTopUsers: async (req, res) => {
    let users = await User.findAll({
      include: { model: User, as: 'Followers' },
      attributes: [
        'id',
        'name',
        'avatar',
        'account',
        [
          sequelize.literal(
            '(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)'
          ),
          'followersCount'
        ]
      ],
      order: [[sequelize.literal('followersCount'), 'DESC']],
      limit: 6
    })

    // Clean up users data
    const followings = helpers
      .getUser(req)
      .Followings.map(following => following.id)

    users = users.map(user => ({
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      account: user.account,
      isFollowed: followings.includes(user.id)
    }))

    return res.status(200).json(users)
  }
}

module.exports = userController

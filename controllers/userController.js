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

    try {
      await User.create({
        account,
        name,
        email,
        password: bcrypt.hashSync(
          req.body.password,
          bcrypt.genSaltSync(10),
          null
        )
      })

      return res.json({
        status: 'success',
        message: `${req.body.email} register successfully! Please login.`
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

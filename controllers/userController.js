const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet

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
        .json({ status: 'error', message: 'That account does not exist.' })
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
      message: 'login successfully',
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        account: user.account,
        avatar: user.avatar,
        introduction: user.introduction,
        cover: user.cover,
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
        role: 'user',
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
      where: { role: 'user' },
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
  },
  getUser: async (req, res) => {
    let user = await User.findByPk(req.params.id, {
      attributes: [
        'id',
        'name',
        'account',
        'email',
        'role',
        'avatar',
        'cover',
        'introduction'
      ],
      include: [
        Tweet,
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })

    // clean up data
    user = {
      id: user.id,
      name: user.name,
      email: user.email,
      account: user.account,
      avatar: user.avatar,
      introduction: user.introduction,
      cover: user.cover,
      role: user.role,
      tweetCount: user.Tweets.length,
      followerCount: user.Followers.length,
      followingCount: user.Followings.length
    }

    res.status(200).json(user)
  },
  editUser: async (req, res) => {
    const {
      account,
      name,
      email,
      password,
      checkPassword,
      avatar,
      cover,
      introduction
    } = req.body
    const emailRule = /^\w+((-\w+)|(\.\w+)|(\+\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
    const errors = []
    const userId = helpers.getUser(req).id
    const id = req.params.id
    // frontend should let us know users are on setting or profile page
    const page = req.body.page

    // Users can only edit their own profile
    if (userId !== Number(id)) {
      return res
        .status(401)
        .json({ status: 'error', message: "You can not edit other's profile" })
    }

    let user = await User.findByPk(userId)

    try {
      // setting
      if (page === 'setting') {
        if (!account || !name || !email || !password || !checkPassword) {
          errors.push({ message: 'Please fill out all fields.' })
        }
        // 要確認 email 跟 account 沒有被使用過
        if (email.search(emailRule) === -1) {
          errors.push({ message: 'Please enter the correct email address.' })
        }
        if (password !== checkPassword) {
          errors.push({ message: 'Password and checkPassword do not match.' })
        }
        if (name.length > 50) {
          errors.push({ message: 'Name can not be longer than 50 characters.' })
        }
        if (account.length > 50) {
          errors.push({
            message: 'Account can not be longer than 50 characters.'
          })
        }
        if (errors.length > 0) {
          return res.json({ status: 'error', errors })
        }
        // make sure email amd account has not been used yet
        user = await User.findOne({ where: { email } })

        if (user && email !== helpers.getUser(req).email) {
          return res.json({
            status: 'error',
            message: `A user with ${email} already exists. Choose a different address or login directly.`
          })
        }

        user = await User.findOne({ where: { account } })

        if (user && account !== helpers.getUser(req).account) {
          return res.json({
            status: 'error',
            message: `A user with account '${account}' already exists. Choose a different account or login directly.`
          })
        }

        user = await User.findByPk(userId)
        await user.update({
          account,
          name,
          email,
          password: bcrypt.hashSync(
            req.body.password,
            bcrypt.genSaltSync(10),
            null
          )
        })

        return res.status(200).json({
          status: 'success',
          message: `${page} update successfully`
        })
      }

      // profile
      if (!name || name.length > 50) {
        errors.push({
          message: 'Name can not be empty or longer than 50 characters'
        })
      }
      if (introduction) {
        if (introduction.length > 160) {
          errors.push({
            message: 'Introduction can not longer than 160 characters'
          })
        }
      }

      await user.update({ name, introduction, avatar, cover })

      return res.status(200).json({
        status: 'success',
        message: 'profile update successfully'
      })
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = userController

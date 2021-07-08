const db = require('../models')
const { User, Tweet, Like } = db
const validator = require('validator')
const bcrypt = require('bcryptjs')

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const userController = {
  signIn: async (req, res) => {
    try {
    // check all inputs are required
      const { account, password } = req.body
      if (!account || !password) {
        return res.json({ status: 'error', message: 'All fields are required!' })
      }
      const user = await User.findOne({ where: { account } })
      if (!user) return res.status(401).json({ status: 'error', message: 'That account is not registered!' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: 'Email or Password incorrect.' })
      }
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.status(200).json({
        status: 'success',
        message: 'ok',
        token: token,
        user: {
          id: user.id,
          account: user.account,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          cover: user.cover,
          role: user.role
        }
      })
    } catch (err) {
      console.log(err)
      res.status(500).json({ status: 'error', message: 'error' })
    }
  },
  signUp: async (req, res) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      const message = []
      // check all inputs are required
      if (!account || !name || !email || !password || !checkPassword) {
        message.push('All fields are required！')
      }
      // check account length and type
      if (name && !validator.isByteLength(name, { min: 0, max: 50 })) {
        message.push('Name can not be longer than 50 characters.')
      }
      // check name length and type
      if (account && !validator.isByteLength(account, { min: 0, max: 20 })) {
        message.push('Account can not be longer than 20 characters.')
      }
      // check email validation
      if (email && !validator.isEmail(email)) {
        message.push(`${email} is not a valid email address.`)
      }
      // check password length and type
      if (password && !validator.isByteLength(password, { min: 5, max: 15 })) {
        message.push('Password does not meet the required length.')
      }
      // check password and checkPassword
      if (password && (password !== checkPassword)) {
        message.push('The password and confirmation do not match.Please retype them.')
      }
      const [inputEmail, inputAccount] = await Promise.all([User.findOne({ where: { email } }), User.findOne({ where: { account } })])
      if (inputEmail) {
        message.push('This email address is already being used.')
      }
      if (inputAccount) {
        message.push('This account is already being used.')
      }
      if (message.length) {
        return res.status(400).json({ status: 'error', message })
      }

      await User.create({
        account,
        name,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
      })
      return res.status(200).json({ status: 'success', message: `@${account} Sign up successfully.Please sign in.` })
    } catch (err) {
      console.log(err)
      res.status(500).json({ status: 'error', message: 'error' })
    }
  },
  getCurrentUser: (req, res) => {
    return res.status(200).json({
      id: req.user.id,
      name: req.user.name,
      account: req.user.account,
      email: req.user.email,
      avatar: req.user.avatar,
      role: req.user.role,
      cover: req.user.cover,
      introduction: req.user.introduction
    })
  },
  getTopUsers: async (req, res) => {
    try {
      let users = await User.findAll({
        include: [
          { model: User, as: 'Followers' }
        ],
        attributes: ['id', 'name', 'email', 'avatar', 'account'],
        limit: 10
      })
      if (!users) {
        return res.status(404).json({ status: 'error', message: 'Cannot find any user in db.' })
      }
      users = users.map(user => ({
        ...user.dataValues,
        followerCount: user.Followers.length,
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
      }))
      users = users.sort((a, b) => b.followerCount - a.followerCount)
      return res.status(200).json({
        users,
        status: 'success',
        message: 'Get top ten users successfully'
      })
    } catch (err) {
      console.log(err)
      res.status(500).json({ status: 'error', message: 'error' })
    }
  },
  editAccount: async (req, res) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      const { email: currentEmail, account: currentAccount } = req.user

      const id = req.params.id

      // only user himself allow to edit account
      if (req.user.id !== Number(id)) {
        return res.status(401).json({ status: 'error', message: 'Permission denied.' })
      }

      // check this user is or not in db
      const user = await User.findByPk(id)
      if (!user) {
        return res.status(404).json({ status: 'error', message: 'Cannot find this user in db.' })
      }

      const message = []

      // check all inputs are required
      if (!account || !name || !email || !password || !checkPassword) {
        message.push('All fields are required！')
      }
      // check account length and type
      if (name && !validator.isByteLength(name, { min: 0, max: 50 })) {
        message.push('Name can not be longer than 50 characters.')
      }
      // check name length and type
      if (account && !validator.isByteLength(account, { min: 0, max: 20 })) {
        message.push('Account can not be longer than 20 characters.')
      }
      // check email validation
      if (email && !validator.isEmail(email)) {
        message.push(`${email} is not a valid email address.`)
      }
      // check password length and type
      if (password && !validator.isByteLength(password, { min: 5, max: 15 })) {
        message.push('Password does not meet the required length.')
      }
      // check password and checkPassword
      if (password && (password !== checkPassword)) {
        message.push('The password and confirmation do not match.Please retype them.')
      }
      if (email !== currentEmail) {
        const userEmail = await User.findOne({ where: { email } })
        if (userEmail) {
          message.push('This email address is already being used.')
        }
      }
      if (account !== currentAccount) {
        const userAccount = await User.findOne({ where: { account } })
        if (userAccount) {
          message.push('This account is already being used.')
        }
      }
      if (message.length) {
        return res.status(400).json({ status: 'error', message })
      }

      await user.update({ name, password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)), email, account })
      return res.status(200).json({ status: 'success', message: `@${account} Update account information successfully.` })
    } catch (err) {
      console.log(err)
      res.status(500).json({ status: 'error', message: 'error' })
    }
  },
  getUser: async (req, res) => {
    try {
      const id = req.params.id
      const user = await User.findOne({
        where: {
          id: id
        },

        include: [
          { model: Tweet },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })
      if (!user) {
        return res.status(404).json({ status: 'error', message: 'Cannot find this user in db.' })
      }

      if (Number(id) !== req.user.id) {
        return res.status(200).json({
          id: user.id,
          name: user.name,
          account: user.account,
          email: user.email,
          avatar: user.avatar,
          cover: user.cover,
          introduction: user.introduction,
          tweetCount: user.Tweets.length,
          followerCount: user.Followers.length,
          followingCount: user.Followings.length,
          isFollowed: req.user.Followings.map(d => d.id).includes(user.id),
          status: 'success',
          message: `Get @${user.account}'s  profile successfully.`
        })
      }
      return res.status(200).json({
        id: user.id,
        name: user.name,
        account: user.account,
        email: user.email,
        avatar: user.avatar,
        cover: user.cover,
        introduction: user.introduction,
        tweetCount: user.Tweets.length,
        followerCount: user.Followers.length,
        followingCount: user.Followings.length,
        status: 'success',
        message: `Get @${user.account}'s  profile successfully.`
      })
    } catch (err) {
      console.log(err)
      res.status(500).json({ status: 'error', message: 'error' })
    }
  }
}

module.exports = userController

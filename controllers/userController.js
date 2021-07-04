const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userService = require('../services/userService')
const tweetService = require('../services/tweetService')

const userController = {
  signIn: async (req, res, next) => {
    try {
      const { email, password } = req.body
      if (!email || !password) {
        throw new Error('Required fields did not exist. (email or password)')
      }
      const user = await userService.signIn(email)
      if (!user) {
        throw new Error('No such user found.')
      }
      if (!bcrypt.compareSync(password, user.password)) {
        throw new Error('Incorrect password word.')
      }

      const payload = { id: user.id }
      const token = jwt.sign(payload, 'JWTSecretIsWeird')
      return res.json({
        status: 200,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      })
    } catch (error) {
      return next(error)
    }
  },
  signUp: async (req, res, next) => {
    try {
      const { checkPassword, ...formBody } = req.body
      const { account, name, email, password } = formBody
      if (!account || !name || !email || !password) {
        throw new Error('All field are required.')
      }
      if (password !== checkPassword) {
        throw new Error('Fields password and checkPassword must be the same.')
      }

      const hash = bcrypt.hashSync(password, 10)
      const user = await userService.signUp({
        ...formBody,
        password: hash
      })

      return res.json({
        data: user
      })
    } catch (error) {
      return next(error)
    }
  },
  getUser: async (req, res, next) => {
    try {
      const user = await userService.getUser(req.params.user_id)
      return res.json({ user })
    } catch (error) {
      return next(error)
    }
  },
  putUser: async (req, res, next) => {
    try {
      const { checkPassword, ...formBody } = req.body
      const { account, name, email, password } = formBody
      if (!account || !name || !email || !password) {
        throw new Error('All field are required.')
      }
      if (password !== checkPassword) {
        throw new Error('Fields password and checkPassword must be the same.')
      }
      if (account === email) {
        throw new Error('Field account and email must be different.')
      }

      const hash = bcrypt.hashSync(password, 10)
      const user = await userService.putUser(req.params.user_id, {
        ...formBody,
        password: hash
      })
      return res.json({ user })
    } catch (error) {
      return next(error)
    }
  },
  putUserProfile: async (req, res, next) => {
    try {
      const user = await userService.putUser(req.params.user_id, { ...req.body })
      return res.json({ user })
    } catch (error) {
      return next(error)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const tweets = await tweetService.getTweets({
        UserId: req.params.user_id
      })
      return res.json({ tweets })
    } catch (error) {
      return next(error)
    }
  },
  getReplies: async (req, res, next) => {
    try {
      const tweets = await tweetService.getAllRepliesFromUser(req.params.user_id)
      return res.json({ tweets })
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = userController

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User, Tweet, Reply, Like, Followship } = require('../models')
const validator = require('validator')
const uploadFile = require('../helpers/file')
const helpers = require('../_helpers')
const { getFollowshipId } = require('../helpers/user')

const userController = {
  login: async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(422).json({
        status: 'error',
        message: 'Missing email or password!'
      })
    }
    try {
      let user = await User.findOne({ where: { email } })

      // User not found
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: "This account doesn't exist."
        })
      }

      // Password incorrect
      if (!bcrypt.compareSync(password, user.password))
        return res.status(401).json({
          status: 'error',
          message: 'Incorrect password.'
        })

      user = user.toJSON()
      // Issue a token to user
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '7d' })
      return res.json({
        status: 'success',
        data: {
          token,
          user
        }
      })
    } catch (error) {
      next(error)
    }
  },

  // User sign up for new account
  register: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body

      // Double check password
      if (password !== checkPassword)
        throw new Error('Please check your password again!')

      // Check if user exists
      const user = await User.findOne({ where: { email } })
      if (user) throw new Error('Email already exists!')

      // Check if account is used
      const accountIsUsed = await User.findOne({ where: { account } })
      if (accountIsUsed) throw new Error('Account is used.')

      // Create new user
      const hash = bcrypt.hashSync(password, 10)
      const newUser = await User.create({
        account,
        name,
        email,
        password: hash,
        role: 'user'
      })

      // Protect sensitive user info
      newUser.password = undefined

      return res.json({ newUser })
    } catch (error) {
      next(error)
    }
  },

  // Get basic user info
  getUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, {
        include: [
          Tweet,
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ],
        attributes: {
          exclude: ['password']
        }
      })

      return res.json(user)
    } catch (error) {
      next(error)
    }
  },

  // Edit user profile
  putUser: async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id
      const id = req.params.id
      const { files } = req
      const { email, password, name, account, introduction } = req.body

      if (userId !== Number(id))
        throw new Error("You cannot edit other's profile.")

      const [usedEmail, usedAccount] = await Promise.all([
        User.findOne({ where: { email } }),
        User.findOne({ where: { account } })
      ])

      if (usedEmail || usedAccount)
        throw new Error('Email and account should be unique.')

      if (!validator.isByteLength(introduction, { min: 0, max: 160 }))
        throw new Error('Introduction must not exceed 160 words.')

      // Get user instance in db
      const user = await User.findByPk(id)

      await user.update({
        email,
        password: password ? bcrypt.hashSync(password, 10) : user.password,
        name,
        account,
        introduction
      })

      // If user uploads images
      const images = {}
      if (files) {
        for (const key in files) {
          images[key] = await uploadFile(files[key][0])
        }
        await user.update({
          cover: images ? images.cover : user.cover,
          avatar: images ? images.avatar : user.avatar
        })
      }

      return res.status(200).json({
        status: 'success',
        message: 'User profile successfully edited.'
      })
    } catch (error) {
      next(error)
    }
  },

  // Get top 10 users
  getTopUsers: async (req, res, next) => {
    try {
      let topUsers = await User.findAll({
        where: { role: 'user' },
        attributes: {
          exclude: ['password']
        },
        order: [['followerCount', 'DESC']],
        limit: 10,
        raw: true
      })

      const followingIds = getFollowshipId(req, 'Followings')

      // Clean data
      topUsers = topUsers.map(user => ({
        ...user,
        isFollowed: followingIds.includes(user.id)
      }))

      return res.status(200).json(topUsers)
    } catch (error) {
      next(error)
    }
  },

  // Get all tweets from specific user
  getUserTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        where: { UserId: req.params.id }
      })

      // add isLiked

      return res.status(200).json(tweets)
    } catch (error) {
      next(error)
    }
  },

  // Get all replied tweets by specific user
  getUserRepliedTweet: async (req, res, next) => {
    try {
      const replies = await Reply.findAll({
        where: { UserId: req.params.id },
        include: [Tweet]
      })

      // add isLiked

      return res.status(200).json(replies)
    } catch (error) {
      next(error)
    }
  },

  getUserLikes: async (req, res, next) => {
    try {
      const likes = await Like.findAll({
        where: { UserId: req.params.id }
      })

      return res.status(200).json(likes)
    } catch (error) {
      next(error)
    }
  },

  getUserFollowings: async (req, res, next) => {
    try {
      const followings = await Followship.findAll({
        where: { followerId: req.params.id }
      })

      return res.status(200).json(followings)
    } catch (error) {
      next(error)
    }
  },

  getUserFollowers: async (req, res, next) => {
    try {
      const followers = await Followship.findAll({
        where: { followingId: req.params.id }
      })

      return res.status(200).json(followers)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = userController

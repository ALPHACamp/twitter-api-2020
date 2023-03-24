const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const validator = require('validator')

const helpers = require('../_helpers')
const sequelize = require('sequelize')
const { User, Like, Reply, Tweet } = require('../models')

const userController = {
  signIn: async (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      return res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      const errors = []

      // check if all the required fields are filled out correctly
      if (!account || !name || !email || !password || !checkPassword) {
        errors.push('All fields are required!')
      }
      if (name && !validator.isByteLength(name, { max: 50 })) {
        errors.push('The name cannot exceed 50 characters.')
      }
      if (password && !validator.isByteLength(password, { min: 8, max: 20 })) {
        errors.push('The password length should be between 8 to 20 characters.')
      }
      if (password !== checkPassword) {
        errors.push('Passwords do not match!')
      }
      if (email && !validator.isEmail(email)) {
        errors.push('Please enter the valid email address!')
      }

      // Check if account and email are unique
      const [userAccount, userEmail] = await Promise.all([
        User.findOne({ where: { account } }),
        User.findOne({ where: { email } })
      ])
      if (userAccount) errors.push('Account already exists')
      if (userEmail) errors.push('Email already exists')

      // Return error message if there are errors
      if (errors.length) {
        return res.status(400).json({ status: 'error', errors })
      }

      // Hash password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      // Create user in DB
      await User.create({
        account,
        name,
        email,
        password: hashedPassword
      })

      return res.status(200).json({ status: 'success', message: 'Successfully signed up!' })
    } catch (err) {
      next(err)
    }
  },
  getUserLikes: async (req, res, next) => {
    try {
      const UserId = req.params.userId
      const likedTweets = await Like.findAll({
        where: { UserId },
        include: [
          { model: User, attributes: [] },
          {
            model: Tweet, attributes: ['id', 'description'],
            include: [
              {
                model: User,
                attributes: ['id', "name", "account", "avatar", "createdAt"],
              },
              { model: User, as: "LikedUsers" },
              { model: User, as: "RepliedUsers" },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
        raw: true,
        nest: true
      })
      if (!likedTweets) {
        return  res.status(404).json({
          status: 'error',
          message: 'Tweet not found!',
        })
      }
      const isLiked = likedTweets.LikedUsers.some(
        (user) => user.id === helpers.getUser(req).id
      )
      return res
        .status(200)
        .json({
          status: "success",
          message: "All liked tweets are retrieved!",
          likedTweets,
          isLiked,
        });
    } catch (error) { next(error) }
  },
  getRepliedTweets: async (req, res, next) => {
    try {
      const { userId } = req.params
      const reply = await Reply.findAll({
        where: { UserId: userId },
        include: [
          { model: User, attributes: ['name', 'avatar', 'account'] },
          {
            model: Tweet,
            attributes: [],
            include: [{ model: User, attributes: ['account'] }]
          }
        ],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })
      if (!reply) throw new Error('Reply does not exist!')
      return res.status(200).json(reply)
    } catch (error) { next(error) }
  }
}

module.exports = userController

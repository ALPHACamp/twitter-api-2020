const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const helpers = require('../_helpers')
const { User, Followship } = require('../models')
const { Op } = require('sequelize')

const userController = {
  signin: async (req, res, next) => {
    try {
      const { account, password } = req.body

      // Check if any field remains blank
      if (!account?.trim() || !password?.trim()) {
        return res.status(400).json({
          status: 'error',
          message: 'All fields are required.'
        })
      }

      // Find user
      const user = await User.findOne({
        raw: true,
        where: {
          account,
          role: 'user'
        }
      })

      // Check if admin exists and password correct
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({
          status: 'error',
          message: 'Account or password incorrect.'
        })
      }

      // Generate token
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      delete user.password

      return res.status(200).json({ token, user })
    } catch (err) {
      next(err)
    }
  },
  signup: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      if (!account?.trim() || !name?.trim() || !email?.trim() || !password?.trim() || !checkPassword?.trim()) {
        return res.status(400).json({
          status: 'error',
          message: 'All fields required.'
        })
      }

      if (name?.length > 50) {
        return res.status(400).json({
          status: 'error',
          message: "Field 'name' should be limited within 50 characters."
        })
      }

      if (password !== checkPassword) {
        return res.status(401).json({
          status: 'error',
          message: 'Password and checkPassword should be the same.'
        })
      }
      const accountExist = await User.findOne({ where: { account } })
      if (accountExist) {
        return res.status(401).json({
          status: 'error',
          message: 'Account already exists. Please try another one.'
        })
      }
      const emailExist = await User.findOne({ where: { email } })
      if (emailExist) {
        return res.status(401).json({
          status: 'error',
          message: 'Email already exists. Please try another one.'
        })
      }

      await User.create({
        account,
        name,
        email,
        password: bcrypt.hashSync(password, 10)
      })

      return res.status(200).json({
        status: 'success',
        message: 'Sign up success.'
      })
    } catch (err) {
      next(err)
    }
  },
  getUser: async (req, res, next) => {
    try {
      const id = req.params.id
      const user = await User.findByPk(id, {
        raw: true,
        nest: true,
        attributes: { exclude: ['password'] }
      })
      if (!user) return res.status(404).json({ status: 'error', message: 'User is not found' })
      return res.status(200).json(user)
    } catch (err) {
      next(err)
    }
  },
  addFollow: async (req, res, next) => {
    try {
      const followerId = Number(helpers.getUser(req).id)
      const followingId = Number(req.body.id)
      if (!followerId || !followingId) {
        return res.status(400).json({
          status: 'error',
          message: 'followerId and followingId required'
        })
      }

      if (followerId === followingId) {
        return res.status(401).json({
          status: 'error',
          message: 'Can not follow yourself.'
        })
      }

      const followed = await Followship.findOne({
        where: { followerId, followingId }
      })
      if (followed) {
        return res.status(401).json({
          status: 'error',
          message: 'Already followed'
        })
      }

      await Followship.create({ followerId, followingId })
      return res.status(200).json({
        status: 'success',
        message: 'Followship added'
      })
    } catch (err) {
      next(err)
    }
  },
  removeFollow: async (req, res, next) => {
    try {
      const followerId = Number(helpers.getUser(req).id)
      const followingId = Number(req.params.followingId)
      if (!followerId || !followingId) {
        return res.status(400).json({
          status: 'error',
          message: 'followerId and followingId required'
        })
      }

      const follower = await User.findByPk(followerId)
      const following = await User.findByPk(followingId)
      if (!follower || !following) {
        return res.status(401).json({
          status: 'error',
          message: 'Follower or following not exists.'
        })
      }

      const followship = await Followship.findOne({
        where: { followerId, followingId }
      })
      if (!followship) {
        return res.status(401).json({
          status: 'error',
          message: 'Not followed yet'
        })
      }

      await followship.destroy()
      return res.status(200).json({
        status: 'success',
        message: 'Remove followed success'
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController

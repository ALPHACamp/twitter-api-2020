const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const helpers = require('../_helpers')
const imgurFileHandler = require('../helpers/file-helpers')
const { User, Tweet, sequelize } = require('../models')

const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      switch (true) {
        case (req.originalUrl === '/api/users/signin' && userData.role !== 'user'):
          res.status(403).json({
            status: 'error',
            message: 'Permission denied.'
          })
          break
        case (req.originalUrl === '/api/admin/signin' && userData.role !== 'admin'):
          res.status(403).json({
            status: 'error',
            message: 'Permission denied.'
          })
          break
        default: {
          const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '15d' })
          return res.json({
            status: 'success', token, user: userData
          })
        }
      }
    } catch (err) {
      next(err)
    }
  },

  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      // check required fields
      if (!account?.trim() || !name?.trim() || !email?.trim() || !password || !checkPassword) throw new Error('All the fields are required.')
      // check password
      if (password !== checkPassword) throw new Error('The password confirmation does not match.')
      // check email format
      if (!validator.isEmail(email)) throw new Error('Email address is invalid.')
      // check length of name
      if (name?.length > 50) throw new Error('Name must be less than 50 characters long.')
      // check account and email existence
      const [userAccount, userEmail] = await Promise.all([
        User.findOne({ where: { account } }),
        User.findOne({ where: { email } })
      ])
      if (userAccount) throw new Error('Account already exists.')
      if (userEmail) throw new Error('Email already exists.')

      const user = await User.create({
        account,
        name,
        email,
        password: bcrypt.hashSync(password, 10)
      })
      return res.json({
        id: user.id,
        account: user.account
      })
    } catch (err) {
      next(err)
    }
  },

  getCurrentUser: (req, res, next) => {
    try {
      const { id, email, account, name, avatar, role } = helpers.getUser(req)
      return res.json({ id, email, account, name, avatar, role })
    } catch (err) {
      next(err)
    }
  },

  putUserProfile: async (req, res, next) => {
    try {
      const { name, introduction } = req.body
      const { files } = req
      const reqUserId = Number(req.params.id)
      const currentUserId = helpers.getUser(req).id
      // check if the user exists
      const user = await User.findByPk(reqUserId)
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'The user does not exist.'
        })
      }
      // check if the req is from current user
      if (reqUserId !== currentUserId) {
        return res.status(403).json({
          status: 'error',
          message: 'User can only edit their own profile.'
        })
      }
      // check required fields
      if (!name?.trim()) throw new Error('Name is required')
      // check length of name
      if (name?.length > 50) throw new Error('Name must be less than 50 characters long.')
      // check length of introduction
      if (introduction?.length > 160) throw new Error('Introduction must be less than 160 characters long.')

      const avatarPath = files?.avatar ? await imgurFileHandler(files.avatar[0]) : user.avatar
      const coverPath = files?.cover ? await imgurFileHandler(files.cover[0]) : user.cover
      await user.update({
        name,
        introduction,
        avatar: avatarPath,
        cover: coverPath
      })
      return res.json({ status: 'success' })
    } catch (err) {
      next(err)
    }
  },

  putUserSetting: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      const reqUserId = Number(req.params.id)
      const currentUserId = helpers.getUser(req).id
      // check if the user exists
      const user = await User.findByPk(reqUserId)
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'The user does not exist.'
        })
      }
      // check if the req is from current user
      if (reqUserId !== currentUserId) {
        return res.status(403).json({
          status: 'error',
          message: 'User can only edit their own profile.'
        })
      }
      // check required fields
      if (!account?.trim() || !name?.trim() || !email?.trim()) throw new Error('Account, name, email are required')
      // check length of name
      if (name?.length > 50) throw new Error('Name must be less than 50 characters long.')
      // check account existence
      if (account !== user.account) {
        const userAccount = await User.findOne({ where: { account } })
        if (userAccount) throw new Error('Account already exists.')
      }
      // check email format and existence
      if (email !== user.email) {
        if (!validator.isEmail(email)) throw new Error('Email address is invalid.')
        const userEmail = await User.findOne({ where: { email } })
        if (userEmail) throw new Error('Email already exists.')
      }
      // check password
      if ((password || checkPassword) && password !== checkPassword) throw new Error('The password confirmation does not match.')

      await user.update({
        account,
        name,
        email,
        password: password ? bcrypt.hashSync(password, 10) : user.password
      })
      return res.json({ status: 'success' })
    } catch (err) {
      next(err)
    }
  },

  getTopUsers: async (req, res, next) => {
    try {
      const currentUser = helpers.getUser(req)
      const LIMIT = 10
      const topUsers = await User.findAll({
        where: { role: 'user' },
        attributes: [
          'id', 'account', 'name', 'avatar',
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)'), 'followerCount']
        ],
        order: [[sequelize.literal('followerCount'), 'DESC']],
        limit: LIMIT,
        raw: true
      })
      // add isFollowed attribute
      const followingsId = new Set()
      currentUser.Followings.forEach(user => followingsId.add(user.id))
      topUsers.forEach(topUser => {
        topUser.isFollowed = followingsId.has(topUser.id)
      })
      return res.json(topUsers)
    } catch (err) {
      next(err)
    }
  },

  getUserTweets: async (req, res, next) => {
    try {
      const reqUserId = Number(req.params.id)
      const currentUserId = helpers.getUser(req).id
      // check if the user exists
      const user = await User.findByPk(reqUserId)
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'The user does not exist.'
        })
      }
      const userTweets = await Tweet.findAll({
        where: { UserId: reqUserId },
        include: { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
        attributes: [
          'id', 'description', 'createdAt',
          [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'replyCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likeCount'],
          [sequelize.literal(`EXISTS(SELECT id FROM Likes WHERE Likes.UserId = ${currentUserId} AND Likes.TweetId = Tweet.id)`), 'isLiked']
        ],
        order: [['createdAt', 'DESC']],
        nest: true,
        raw: true
      })
      return res.json(userTweets)
    } catch (err) {
      next(err)
    }
  },

  getUserFollowings: async (req, res, next) => {
    try {
      const followerId = Number(req.params.id)
      const currentUserId = helpers.getUser(req).id
      // check if the user exists
      const targetUser = await User.findByPk(followerId)
      if (!targetUser || targetUser.role === 'admin') return res.status(404).json({ status: 'error', message: 'The user does not exist.' })

      const user = await User.findByPk(followerId, {
        include: [{
          model: User,
          as: 'Followings',
          attributes: [
            ['id', 'followingId'],
            'account', 'name', 'introduction', 'avatar',
            [sequelize.literal(`EXISTS(SELECT id FROM Followships WHERE Followships.followerId = ${currentUserId} AND Followships.followingId = Followings.id)`), 'isFollowed']
          ]
        }],
        attributes: ['id'],
        nest: true
      })
      user.Followings.sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)
      res.json(user.Followings)
    } catch (err) {
      next(err)
    }
  },

  getUserFollowers: async (req, res, next) => {
    try {
      const followingId = Number(req.params.id)
      const currentUserId = helpers.getUser(req).id
      // check if the user exists
      const targetUser = await User.findByPk(followingId)
      if (!targetUser || targetUser.role === 'admin') return res.status(404).json({ status: 'error', message: 'The user does not exist.' })

      const user = await User.findByPk(followingId, {
        include: [{
          model: User,
          as: 'Followers',
          attributes: [
            ['id', 'followerId'],
            'account', 'name', 'introduction', 'avatar',
            [sequelize.literal(`EXISTS(SELECT id FROM Followships WHERE Followships.followerId = ${currentUserId} AND Followships.followingId = Followers.id)`), 'isFollowed']
          ]
        }],
        attributes: ['id'],
        nest: true
      })
      user.Followers.sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)
      res.json(user.Followers)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController

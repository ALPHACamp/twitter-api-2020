const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const helpers = require('../_helpers')
const imgurFileHandler = require('../helpers/file-helpers')
const { User, Tweet, Reply, Like, Followship, sequelize } = require('../models')

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
      const currentUser = helpers.getUser(req)
      return res.json(currentUser)
    } catch (err) {
      next(err)
    }
  },

  getUserProfile: async (req, res, next) => {
    try {
      const reqUserId = Number(req.params.id)
      const user = await User.findByPk(reqUserId, {
        attributes: [
          'id', 'account', 'name', 'avatar', 'cover', 'introduction', 'role',
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE followingId = User.id)'), 'followerCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE followerId = User.id)'), 'followingCount']
        ]
      })
      // check if the user exists
      if (!user || user.role === 'admin') return res.status(404).json({ status: 'error', message: 'The user does not exist.' })
      return res.json(user)
    } catch (err) {
      next(err)
    }
  },

  putUserProfile: async (req, res, next) => {
    try {
      const { name, introduction } = req.body
      const { files } = req
      const reqUserId = Number(req.params.id)
      // check required fields
      if (!name?.trim()) throw new Error('Name is required')
      // check length of name
      if (name?.length > 50) throw new Error('Name must be less than 50 characters long.')
      // check length of introduction
      if (introduction?.length > 160) throw new Error('Introduction must be less than 160 characters long.')

      const user = await User.findByPk(reqUserId)
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
      // check required fields
      if (!account?.trim() || !name?.trim() || !email?.trim()) throw new Error('Account, name, email are required')
      // check length of name
      if (name?.length > 50) throw new Error('Name must be less than 50 characters long.')
      // check password
      if ((password || checkPassword) && password !== checkPassword) throw new Error('The password confirmation does not match.')

      const user = await User.findByPk(reqUserId)
      // check email format
      if (email !== user.email && !validator.isEmail(email)) throw new Error('Email address is invalid.')

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
      const currentUserId = helpers.getUser(req).id
      const LIMIT = 10
      const topUsers = await User.findAll({
        where: { role: 'user' },
        attributes: [
          'id', 'account', 'name', 'avatar',
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)'), 'followerCount'],
          [sequelize.literal(`EXISTS(SELECT id FROM Followships WHERE Followships.followerId = ${currentUserId} AND Followships.followingId = User.id)`), 'isFollowed']
        ],
        order: [[sequelize.literal('followerCount'), 'DESC']],
        limit: LIMIT,
        raw: true
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
      const [user, userTweets] = await Promise.all([
        User.findByPk(reqUserId),
        Tweet.findAll({
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
      ])
      // check if the user exists
      if (!user || user.role === 'admin') return res.status(404).json({ status: 'error', message: 'The user does not exist.' })

      return res.json(userTweets)
    } catch (err) {
      next(err)
    }
  },

  getUserReplies: async (req, res, next) => {
    try {
      const reqUserId = Number(req.params.id)
      const [user, userReplies] = await Promise.all([
        User.findByPk(reqUserId),
        Reply.findAll({
          where: { UserId: reqUserId },
          attributes: ['id', 'comment', 'createdAt'],
          include: [
            { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
            {
              model: Tweet,
              attributes: ['id'],
              include: [{ model: User, attributes: ['id', 'account'] }]
            }
          ],
          order: [['createdAt', 'DESC']],
          nest: true,
          raw: true
        })
      ])
      // check if the user exists
      if (!user || user.role === 'admin') return res.status(404).json({ status: 'error', message: 'The user does not exist.' })

      return res.json(userReplies)
    } catch (err) {
      next(err)
    }
  },

  getUserLikedTweets: async (req, res, next) => {
    try {
      const reqUserId = Number(req.params.id)
      const currentUserId = helpers.getUser(req).id
      const [user, likedTweets] = await Promise.all([
        User.findByPk(reqUserId),
        Like.findAll({
          where: { UserId: reqUserId },
          attributes: ['id', 'TweetId', 'createdAt'],
          include: {
            model: Tweet,
            attributes: [
              'id', 'description', 'createdAt',
              [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'replyCount'],
              [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likeCount'],
              [sequelize.literal(`EXISTS(SELECT id FROM Likes WHERE Likes.UserId = ${currentUserId} AND Likes.TweetId = Tweet.id)`), 'isLiked']
            ],
            include: {
              model: User,
              attributes: ['id', 'name', 'account', 'avatar']
            }
          },
          order: [['createdAt', 'DESC']],
          nest: true,
          raw: true
        })
      ])
      // check if the user exists
      if (!user || user.role === 'admin') return res.status(404).json({ status: 'error', message: 'The user does not exist.' })

      return res.json(likedTweets)
    } catch (err) {
      next(err)
    }
  },

  getUserFollowings: async (req, res, next) => {
    try {
      const reqUserId = Number(req.params.id)
      const currentUserId = helpers.getUser(req).id
      const [user, followings] = await Promise.all([
        User.findByPk(reqUserId),
        Followship.findAll({
          where: { followerId: reqUserId },
          include: {
            model: User,
            as: 'Followings',
            attributes: [
              'id', 'account', 'name', 'introduction', 'avatar',
              [sequelize.literal(`EXISTS(SELECT id FROM Followships WHERE Followships.followerId = ${currentUserId} AND Followships.followingId = Followings.id)`), 'isFollowed']
            ]
          },
          order: [['createdAt', 'DESC']],
          nest: true,
          raw: true
        })
      ])
      // check if the user exists
      if (!user || user.role === 'admin') return res.status(404).json({ status: 'error', message: 'The user does not exist.' })

      return res.json(followings)
    } catch (err) {
      next(err)
    }
  },

  getUserFollowers: async (req, res, next) => {
    try {
      const reqUserId = Number(req.params.id)
      const currentUserId = helpers.getUser(req).id
      const [user, followers] = await Promise.all([
        User.findByPk(reqUserId),
        Followship.findAll({
          where: { followingId: reqUserId },
          include: {
            model: User,
            as: 'Followers',
            attributes: [
              'id', 'account', 'name', 'introduction', 'avatar',
              [sequelize.literal(`EXISTS(SELECT id FROM Followships WHERE Followships.followerId = ${currentUserId} AND Followships.followingId = Followers.id)`), 'isFollowed']
            ]
          },
          order: [['createdAt', 'DESC']],
          nest: true,
          raw: true
        })
      ])
      // check if the user exists
      if (!user || user.role === 'admin') return res.status(404).json({ status: 'error', message: 'The user does not exist.' })

      return res.json(followers)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController

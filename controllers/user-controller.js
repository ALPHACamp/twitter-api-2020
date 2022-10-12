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
          return res.status(403).json({
            status: 'error',
            message: 'Permission denied.'
          })
        case (req.originalUrl === '/api/admin/signin' && userData.role !== 'admin'):
          return res.status(403).json({
            status: 'error',
            message: 'Permission denied.'
          })
        default: {
          const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '15d' })
          return res.status(200).json({
            status: 'success',
            token,
            user: userData
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
      if (!account?.trim() || !name?.trim() || !email?.trim() || !password || !checkPassword) {
        return res.status(400).json({
          status: 'error',
          message: 'All the fields are required.'
        })
      }
      if (password !== checkPassword) {
        return res.status(422).json({
          status: 'error',
          message: 'The password confirmation does not match.'
        })
      }
      if (!validator.isEmail(email)) {
        return res.status(422).json({
          status: 'error',
          message: 'Email address is invalid.'
        })
      }
      if (name?.length > 50) {
        return res.status(422).json({
          status: 'error',
          message: 'Name must be less than 50 characters long.'
        })
      }

      const user = await User.create({
        account,
        name,
        email,
        password: bcrypt.hashSync(password, 10)
      })
      return res.status(200).json({
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
      return res.status(200).json(currentUser)
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
      if (!user || user.role === 'admin') {
        return res.status(404).json({
          status: 'error',
          message: 'The user does not exist.'
        })
      }
      return res.status(200).json(user)
    } catch (err) {
      next(err)
    }
  },

  putUserProfile: async (req, res, next) => {
    try {
      const { name, introduction } = req.body
      const { files } = req
      const reqUserId = Number(req.params.id)
      if (!name?.trim()) {
        return res.status(400).json({
          status: 'error',
          message: 'Name is required.'
        })
      }
      if (name?.length > 50) {
        return res.status(422).json({
          status: 'error',
          message: 'Name must be less than 50 characters long.'
        })
      }
      if (introduction?.length > 160) {
        return res.status(422).json({
          status: 'error',
          message: 'Introduction must be less than 160 characters long.'
        })
      }
      // create the update option
      const option = { name, introduction }
      if (files?.avatar) option.avatar = await imgurFileHandler(files.avatar[0])
      if (files?.cover) option.cover = await imgurFileHandler(files.cover[0])

      const user = await User.findByPk(reqUserId)
      await user.update(option)
      return res.status(200).json({ status: 'success' })
    } catch (err) {
      next(err)
    }
  },

  putUserSetting: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      const reqUserId = Number(req.params.id)
      if (!account?.trim() || !name?.trim() || !email?.trim()) {
        return res.status(400).json({
          status: 'error',
          message: 'Account, name, email are required.'
        })
      }
      if (name?.length > 50) {
        return res.status(422).json({
          status: 'error',
          message: 'Name must be less than 50 characters long.'
        })
      }
      if ((password || checkPassword) && password !== checkPassword) {
        return res.status(422).json({
          status: 'error',
          message: 'The password confirmation does not match.'
        })
      }
      if (!validator.isEmail(email)) {
        return res.status(422).json({
          status: 'error',
          message: 'Email address is invalid.'
        })
      }
      // create the update option
      const option = { account, name, email }
      if (password) option.password = bcrypt.hashSync(password, 10)

      const user = await User.findByPk(reqUserId)
      await user.update(option)
      return res.status(200).json({ status: 'success' })
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
      return res.status(200).json(topUsers)
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
      if (!user || user.role === 'admin') {
        return res.status(404).json({
          status: 'error',
          message: 'The user does not exist.'
        })
      }
      return res.status(200).json(userTweets)
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
      if (!user || user.role === 'admin') {
        return res.status(404).json({
          status: 'error',
          message: 'The user does not exist.'
        })
      }
      return res.status(200).json(userReplies)
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
      if (!user || user.role === 'admin') {
        return res.status(404).json({
          status: 'error',
          message: 'The user does not exist.'
        })
      }
      return res.status(200).json(likedTweets)
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
      if (!user || user.role === 'admin') {
        return res.status(404).json({
          status: 'error',
          message: 'The user does not exist.'
        })
      }
      return res.status(200).json(followings)
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
      if (!user || user.role === 'admin') {
        return res.status(404).json({
          status: 'error',
          message: 'The user does not exist.'
        })
      }
      return res.status(200).json(followers)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController

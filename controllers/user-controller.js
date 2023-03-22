const { User, Tweet, Reply, Like, Followship } = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { imgurFileHandler } = require('../_helpers')

const userController = {
  getUser: (req, res, next) => {
    return User.findByPk(req.params.userId)
      .then(user => {
        if (!user) {
          const error = new Error("User doesn't exist!")
          error.status = 404
          throw error
        }

        return res.json({ status: 'success', user })
      })
      .catch(error => next(error))
  },

  getUserTweets: (req, res, next) => {
    return Tweet.findAll({
      where: { userId: req.params.userId },
      limit: 5,
      include: User,
      attributes: ['user_id'],
      order: [['created_at', 'desc']],
      raw: true,
      nest: true
    })
      .then(tweets => {
        if (!tweets) {
          const error = new Error("Tweets don't exist!")
          error.status = 404
          throw error
        }

        return res.json({ status: 'success', tweets })
      })
      .catch(error => next(error))
  },

  getUserReplies: (req, res, next) => {
    return Reply.findAll({
      where: { userId: req.params.userId },
      limit: 5,
      include: User,
      attributes: ['user_id'],
      order: [['created_at', 'desc']],
      raw: true,
      nest: true
    })
      .then(replies => {
        if (!replies) {
          const error = new Error("Replies don't exist!")
          error.status = 404
          throw error
        }

        return res.json({ status: 'success', replies })
      })
      .catch(error => next(error))
  },

  getUserLikes: (req, res, next) => {
    return Like.findAll({
      where: { userId: req.params.userId },
      limit: 5,
      include: User,
      attributes: ['user_id'],
      order: [['created_at', 'desc']],
      raw: true,
      nest: true
    })
      .then(likes => {
        if (!likes) {
          const error = new Error("likes don't exist!")
          error.status = 404
          throw error
        }

        return res.json({ status: 'success', likes })
      })
      .catch(error => next(error))
  },

  getUserFollowers: (req, res, next) => {
    return Followship.findAll({
      where: { followingId: req.params.userId },
      include: User,
      attributes: ['user_id'],
      order: [['created_at', 'desc']],
      raw: true,
      nest: true
    })
      .then(followers => res.json({ status: 'success', followers }))
      .catch(error => next(error))
  },

  getUserFollowings: (req, res, next) => {
    return Followship.findAll({
      where: { followerId: req.params.userId },
      include: User,
      attributes: ['user_id'],
      order: [['created_at', 'desc']],
      raw: true,
      nest: true
    })
      .then(followings => res.json({ status: 'success', followings }))
      .catch(error => next(error))
  },

  signUp: (req, res, next) => {
    const { name, email, password, account } = req.body

    if (password !== req.body.checkPassword) {
      const error = new Error('Passwords do not match!')
      error.status = 404
      throw error
    }

    return Promise.all([
      User.findOne({ where: { account } }),
      User.findOne({ where: { email } })
    ])
      .then(([account, email]) => {
        if (account) {
          const error = new Error('Account already exist!')
          error.status = 404
          throw error
        }

        if (email) {
          const error = new Error('Email already exist!')
          error.status = 404
          throw error
        }

        return bcrypt.hash(password, 10)
      })
      .then(hash => {
        return User.create({
          name,
          account,
          email,
          password: hash
        })
      })
      .then(newUser => {
        delete newUser.password
        return res.json({ status: 'success', newUser })
      })
      .catch(error => next(error))
  },

  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: '30d'
      })
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (error) {
      next(error)
    }
  },

  putUser: (req, res, next) => {
    const { file } = req
    const { name, introduction } = req.body

    return Promise.all([
      User.findByPk(req.params.userId),
      imgurFileHandler(...file)
    ])
      .then(([user, ...filePath]) => {
        if (!user) {
          const error = new Error('User already exist!')
          error.status = 404
          throw error
        }

        return user.update({
          name,
          introduction,
          avatar: filePath[0] || user.avatar,
          coverUrl: filePath[1] || user.coverUrl
        })
      })
      .then(updatedUser => res.json({ status: 'success', updatedUser }))
      .catch(error => next(error))
  },

  patchUser: (req, res, next) => {
    const { account, password, email, checkPassword } = req.body

    return User.findByPk(req.params.userId)
      .then(user => {
        if (!user) {
          const error = new Error("User doesn't exist!")
          error.status = 404
          throw error
        }
        if (password !== checkPassword) {
          const error = new Error('Passwords do not match!')
          error.status = 404
          throw error
        }

        return user.update({
          account,
          email,
          password: bcrypt.hash(password, 10)
        })
      })
      .catch(error => next(error))
  }

}

module.exports = userController

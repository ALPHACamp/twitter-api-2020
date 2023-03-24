const { User, sequelize } = require('../models')
const bcrypt = require('bcryptjs')
const createError = require('http-errors')
const jwt = require('jsonwebtoken')
const { getUser, imgurFileHandler } = require('../_helpers')

const userController = {
  getUser: (req, res, next) => {
    // 無法拿到其他用戶的資源
    if (getUser(req).id.toString() !== req.params.userId) next(createError(401, 'You don’t have permission to request that URL'))
    return User.findByPk(req.params.userId)
      .then(user => {
        if (!user) {
          const error = new Error("User doesn't exist!")
          error.status = 404
          throw error
        }
        return res.json({ status: 'success', ...user.toJSON() })
      })
      .catch(error => next(error))
  },

  getUserTweets: (req, res, next) => {
    // 無法拿到其他用戶的資源
    if (getUser(req).id.toString() !== req.params.userId) next(createError(401, 'You don’t have permission to request that URL'))
    return sequelize.query('SELECT description FROM tweets WHERE user_id = :userId ORDER BY created_at LIMIT 5',
      {
        replacements: { userId: req.params.userId },
        type: sequelize.QueryTypes.SELECT
      })
      .then(tweets => {
        if (!tweets) {
          const error = new Error("Tweets don't exist!")
          error.status = 404
          throw error
        }

        return res.json(tweets)
      })
      .catch(error => next(error))
  },

  getUserReplies: (req, res, next) => {
    // 無法拿到其他用戶的資源
    if (getUser(req).id.toString() !== req.params.userId) next(createError(401, 'You don’t have permission to request that URL'))
    return sequelize.query('SELECT comment FROM replies WHERE user_id = :userId ORDER BY created_at LIMIT 5',
      {
        replacements: { userId: req.params.userId },
        type: sequelize.QueryTypes.SELECT
      })
      .then(replies => {
        if (!replies) {
          const error = new Error("Replies don't exist!")
          error.status = 404
          throw error
        }

        return res.json(replies)
      })
      .catch(error => next(error))
  },

  getUserLikes: (req, res, next) => {
    // 無法拿到其他用戶的資源
    if (getUser(req).id.toString() !== req.params.userId) next(createError(401, 'You don’t have permission to request that URL'))
    return sequelize.query('SELECT Tweet_id TweetId FROM likes WHERE User_id = :userId',
      {
        replacements: { userId: req.params.userId },
        type: sequelize.QueryTypes.SELECT
      })
      .then(likes => {
        if (!likes) {
          const error = new Error("likes don't exist!")
          error.status = 404
          throw error
        }

        return res.json(likes)
      })
      .catch(error => next(error))
  },

  getUserFollowers: (req, res, next) => {
    // 無法拿到其他用戶的資源
    if (getUser(req).id.toString() !== req.params.userId) next(createError(401, 'You don’t have permission to request that URL'))
    return sequelize.query('SELECT Follower_id followerId FROM users u JOIN followships f ON u.id = f.Following_Id WHERE u.id = :userId',
      {
        replacements: { userId: req.params.userId },
        type: sequelize.QueryTypes.SELECT
      })
      .then(followers => res.json(followers))
      .catch(error => next(error))
  },

  // 不能直接從followship去找，要從user
  getUserFollowings: (req, res, next) => {
    // 無法拿到其他用戶的資源
    if (getUser(req).id.toString() !== req.params.userId) next(createError(401, 'You don’t have permission to request that URL'))
    return sequelize.query('SELECT Following_id followingId FROM users u JOIN followships f ON u.id = f.Follower_Id WHERE u.id = :userId',
      {
        replacements: { userId: req.params.userId },
        type: sequelize.QueryTypes.SELECT
      })
      .then(followings => res.json(followings))
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
    // 無法拿到其他用戶的資源
    if (getUser(req).id.toString() !== req.params.userId) next(createError(401, 'You don’t have permission to request that URL'))
    const { file } = req
    const { name, introduction } = req.body
    return Promise.all([
      User.findByPk(req.params.userId),
      imgurFileHandler(file)
    ])
      .then(([user, ...filePath]) => {
        if (!user) {
          const error = new Error("User didn't exist!")
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

  patchUser: (req, _, next) => {
    // 無法拿到其他用戶的資源
    if (getUser(req).id.toString() !== req.params.userId) next(createError(401, 'You don’t have permission to request that URL'))
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

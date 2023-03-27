const { User, sequelize } = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const createError = require('http-errors')
const { imgurFileHandler } = require('../_helpers')
const helpers = require('../_helpers')

const userController = {
  getUser: (req, res, next) => {
    if (helpers.getUser(req).id.toString() !== req.params.userId) next(createError(403, 'Forbidden Error'))
    return User.findByPk(req.params.userId)
      .then(user => {
        if (!user) next(createError(404, "User doesn't exist!"))
        return res.json({ ...user.toJSON() })
      })
      .catch(error => next(error))
  },

  getUserTweets: (req, res, next) => {
    if (helpers.getUser(req).id.toString() !== req.params.userId) next(createError(403, 'Forbidden Error'))
    return sequelize.query('SELECT description FROM Tweets WHERE user_id = :userId ORDER BY created_at LIMIT 5',
      {
        replacements: { userId: req.params.userId },
        type: sequelize.QueryTypes.SELECT
      })
      .then(tweets => {
        return res.json(tweets)
      })
      .catch(error => next(error))
  },

  getUserReplies: (req, res, next) => {
    if (helpers.getUser(req).id.toString() !== req.params.userId) next(createError(403, 'Forbidden Error'))
    return sequelize.query('SELECT comment FROM Replies WHERE user_id = :userId ORDER BY created_at LIMIT 5',
      {
        replacements: { userId: req.params.userId },
        type: sequelize.QueryTypes.SELECT
      })
      .then(replies => {
        return res.json(replies)
      })
      .catch(error => next(error))
  },

  getUserLikes: (req, res, next) => {
    if (helpers.getUser(req).id.toString() !== req.params.userId) next(createError(403, 'Forbidden Error'))
    return sequelize.query('SELECT Tweet_id TweetId FROM Likes WHERE User_id = :userId',
      {
        replacements: { userId: req.params.userId },
        type: sequelize.QueryTypes.SELECT
      })
      .then(likes => {
        return res.json(likes)
      })
      .catch(error => next(error))
  },

  getUserFollowers: (req, res, next) => {
    return sequelize.query('SELECT Follower_id followerId FROM Users u JOIN Followships f ON u.id = f.Following_Id WHERE u.id = :userId',
      {
        replacements: { userId: req.params.userId },
        type: sequelize.QueryTypes.SELECT
      })
      .then(followers => res.json(followers))
      .catch(error => next(error))
  },

  // 不能直接從followship去找，要從user
  getUserFollowings: (req, res, next) => {
    if (helpers.getUser(req).id.toString() !== req.params.userId) next(createError(403, 'Forbidden Error'))
    return sequelize.query('SELECT Following_id followingId FROM Users u JOIN Followships f ON u.id = f.Follower_Id WHERE u.id = :userId',
      {
        replacements: { userId: req.params.userId },
        type: sequelize.QueryTypes.SELECT
      })
      .then(followings => res.json(followings))
      .catch(error => next(error))
  },

  signUp: (req, res, next) => {
    const { name, email, password, account } = req.body

    if (password !== req.body.checkPassword) next(createError(400, 'Passwords do not match!'))
    if (name.length > 50) next(createError(400, 'The length of name exceeds 50 characters.'))

    return Promise.all([
      User.findOne({ where: { account } }),
      User.findOne({ where: { email } })
    ])
      .then(([account, email]) => {
        if (account) next(createError(409, 'This account is already registered'))
        if (email) next(createError(409, 'This email is already registered'))

        return bcrypt.hash(password, 10)
      })
      .then(hash => {
        return User.create({
          name,
          account,
          email,
          password: hash,
          role: 'user'
        })
      })
      .then(newUser => {
        delete newUser.password
        return res.json(newUser)
      })
      .catch(error => next(error))
  },

  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      if (userData.role !== 'user') next(createError(403, 'Access to the requested resource is forbidden'))
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: '30d'
      })
      res.json({
        token,
        user: userData
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
      .then(updatedUser => res.json(updatedUser))
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

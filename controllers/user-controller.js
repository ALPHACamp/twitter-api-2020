const { User, sequelize } = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const createError = require('http-errors')
const { imgurFileHandler } = require('../_helpers')
const helpers = require('../_helpers')

const userController = {
  getUser: (req, res, next) => {
    if (helpers.getUser(req).id.toString() !== req.params.userId) throw createError(403, 'Forbidden Error')
    return User.findByPk(req.params.userId, { attributes: { exclude: ['password'] } })
      .then(user => res.json({ ...user.toJSON() }))
      .catch(error => next(error))
  },

  getUserTweets: (req, res, next) => {
    return sequelize.query('SELECT description, !ISNULL(like_tweet.tweet_id) isLiked FROM Tweets t LEFT JOIN (SELECT tweet_id FROM Likes WHERE user_id = :ownId) like_tweet ON t.id = like_tweet.tweet_id WHERE t.user_id = :userId ORDER BY t.created_at DESC LIMIT 5',
      {
        replacements: { userId: req.params.userId, ownId: helpers.getUser(req).id },
        type: sequelize.QueryTypes.SELECT
      })
      .then(tweets => {
        return res.json(tweets)
      })
      .catch(error => next(error))
  },

  getUserReplies: (req, res, next) => {
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
    return sequelize.query('WITH ownLike AS (SELECT tweet_id FROM Likes WHERE user_id = :ownId) SELECT l.tweet_id TweetId, !ISNULL(ownLike.tweet_id) isliked FROM Likes l LEFT JOIN ownLike USING(tweet_id) WHERE l.user_id = :userId',
      {
        replacements: { userId: req.params.userId, ownId: helpers.getUser(req).id },
        type: sequelize.QueryTypes.SELECT
      })
      .then(likes => {
        return res.json(likes)
      })
      .catch(error => next(error))
  },

  getUserFollowers: (req, res, next) => {
    return sequelize.query('WITH follow AS (SELECT following_id own_follow FROM Followships WHERE follower_id = :ownId) SELECT follower_id followerId, !ISNULL(own_follow) isFollowed FROM Followships f1 LEFT JOIN follow f2 ON follower_id = own_follow WHERE f1.following_id = :userId',
      {
        replacements: { userId: req.params.userId, ownId: helpers.getUser(req).id },
        type: sequelize.QueryTypes.SELECT
      })
      .then(followers => res.json(followers))
      .catch(error => next(error))
  },

  getUserFollowings: (req, res, next) => {
    return sequelize.query('WITH follow AS (SELECT following_id own_follow FROM Followships WHERE follower_id = :ownId) SELECT following_id followingId, !ISNULL(own_follow) isFollowed FROM Followships f1 LEFT JOIN follow f2 ON following_id = own_follow WHERE f1.follower_id = :userId',
      {
        replacements: { userId: req.params.userId, ownId: helpers.getUser(req).id },
        type: sequelize.QueryTypes.SELECT
      })
      .then(followings => res.json(followings))
      .catch(error => next(error))
  },

  signUp: (req, res, next) => {
    const { name, email, password, account } = req.body

    if (password !== req.body.checkPassword) throw createError(400, 'Passwords do not match!')
    if (name.length > 50) throw createError(400, 'The length of name exceeds 50 characters.')

    return Promise.all([
      User.findOne({ where: { account } }),
      User.findOne({ where: { email } })
    ])
      .then(([account, email]) => {
        if (account) throw createError(409, 'This account is already registered')
        if (email) throw createError(409, 'This email is already registered')
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
        delete newUser.dataValues.password
        return res.json(newUser)
      })
      .catch(error => next(error))
  },

  signIn: (req, res, next) => {
    try {
      const { password, ...userData } = helpers.getUser(req).toJSON()
      if (userData.role !== 'user') throw createError(403, 'Access to the requested resource is forbidden')
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
    if (helpers.getUser(req).id.toString() !== req.params.userId) throw createError(403, 'Forbidden Error')
    const { files } = req
    const { name, introduction } = req.body
    return Promise.all([
      User.findByPk(req.params.userId),
      imgurFileHandler(files)
    ])
      .then(([user, ...filePath]) => {
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

  patchUser: async (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    const checkDuplicate = await sequelize.query('SELECT (SELECT COUNT(1) FROM Users WHERE id <> :userId AND account = :account) AS accountCheck, (SELECT COUNT(1) FROM Users WHERE id <> :userId AND email = :email) AS emailCheck',
      {
        replacements: { userId: req.params.userId, account, email },
        type: sequelize.QueryTypes.SELECT
      })
    if (password !== checkPassword) throw next(createError(403, 'Password not match!'))
    if (checkDuplicate[0].accountCheck) throw next(createError(409, 'Account already exists!'))
    if (checkDuplicate[0].emailCheck) throw next(createError(409, 'Email already exists!'))
    if (helpers.getUser(req).id.toString() !== req.params.userId) throw next(createError(403, 'Forbidden Error'))
    const hashPassword = await bcrypt.hash(password, 10)
    return await sequelize.query('UPDATE Users SET name=:name, account=:account, email=:email, password=:password WHERE id=:userId',
      {
        replacements: {
          userId: req.params.userId,
          account,
          name,
          email,
          password: hashPassword
        },
        type: sequelize.QueryTypes.UPDATE
      })
      // Results will be an empty array and metadata will contain the number of affected rows.
      .then(([results, metadata]) => {
        const { password, checkPassword, ...others } = req.body
        res.json(others)
      })
      .catch(error => next(error))
  }
}

module.exports = userController

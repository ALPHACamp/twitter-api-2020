const bcrypt = require('bcryptjs')
const { User, Reply, Tweet, Followship, Like } = require('../models')
const jwt = require('jsonwebtoken')
const { imgurFileHandler } = require('../helpers/file-helpers')
const helpers = require('../_helpers')
// sequelize Op 比較功能
const { Op } = require('sequelize')

const userServices = {
  signIn: (req, cb) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      cb(null, {
        status: 'success',
        data: {
          token,
          user: userData,
        }
      })
    } catch (err) {
      cb(err)
    }
  },
  signUp: ({ name, email, password, account }, cb) => {
    return Promise.all([
      User.findOne({ where: { email } }),
      User.findOne({ where: { account } })
    ])
      .then(([user, account]) => {
        if (user) throw new Error('Email already exists!')
        if (account) throw new Error('Account already registered!')
        return bcrypt.hash(password, 10)
      })
      .then(hash => {
        return User.create({
          name,
          email,
          role: 'user',
          account,
          password: hash
        })
      })
      .then((user) => {
        user = user.toJSON()
        delete user.password
        return cb(null, {
          status: 'success',
          user
        })
      })
      .catch(err => cb(err))
  },
  getUser: (req, cb) => {
    return Promise.all([
      User.findByPk(req.params.id, { attributes: { exclude: ['password'] } }),
      Followship.count({ where: { followerId: req.params.id } }),
      Followship.count({ where: { followingId: req.params.id } }),
      Tweet.findAll({ where: { UserId: req.params.id } })
    ])
      .then(([user, follower, following, Tweet]) => {
        if (!user) throw new Error(`User didn't exist`)
        user = user.toJSON()
        user.followerCount = follower // 追蹤數量
        user.followingCount = following // 被追蹤數量
        user.TweetCount = Tweet.length
        const currentUser = helpers.getUser(req)
        user.isFollowing = currentUser.Followings ? currentUser.Followings.some(f => f.id === user.id) : false
        return cb(null, {
          status: 'success',
          user
        })
      })
      .catch(err => cb(err))
  }
}

module.exports = userServices
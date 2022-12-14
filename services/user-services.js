const { User, Like, Favorite, Tweet, Followship, Reply } = require('./../models')
const jwt = require('jsonwebtoken')
const { imgurFileHandler } = require('../helpers/file-helpers')
const bcrypt = require('bcryptjs')
const userServices = {
  loginUser: (req, cb) => {
    try {
      delete req.user.password
      const userData = req.user.toJSON()
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      cb(null, {
        token,
        user: userData
      })
    } catch (err) {
      cb(err)
    }
  },
  registerUser: (req, cb) => {
    // password check
    if (req.body.password !== req.body.checkPassword) throw new Error('Passwords do not match!')
    // account and email check
    Promise.all([
      User.findOne({ where: { account: req.body.account } }), User.findOne({ where: { email: req.body.email } })
    ])
      .then(([userWithAccount, userWithEmail]) => {
        if (userWithAccount) throw new Error('Account already exists!')
        if (userWithEmail) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        account: req.body.account,
        name: req.body.name,
        email: req.body.email,
        password: hash,
        role: 'user',
        avatar: `https://loremflickr.com/320/240/cat?random=${Math.random() * 100}`,
        cover: `https://loremflickr.com/820/312/space?random=${Math.random() * 100}`
      }))
      .then(user => {
        delete user.password
        return cb(null, {
          user
        })
      })
      .catch(err => cb(err))
  },
  getUsers: (req, cb) => {
    return User.findAll({
      nest: true,
      raw: true
    })
      .then(users => {
        return cb(null, users)
      })
      .catch(err => cb(err))
  },
  getUser: (req, cb) => {
    return User.findByPk(req.params.userId, { raw: true })
      .then(user => {
        if (!user) throw new Error('user do not exist.')
        cb(null, user)
      })
      .catch(err => cb(err))
  },
  getTopUsers: (req, cb) => { // Still needs to be fixed
    const limit = Number(req.query.top)
    return Followship.findAll({
      include: [{ model: User }],
      attributes: ['following_id'],
      group: ['following_id'],
      limit
    })
      .then(popularUsers => {
        const data = popularUsers.map(p => ({
          ...p.User.toJSON()
        }))
        return cb(null, { popularUsers: data })
      })
      .catch(err => cb(err))
  },
  editUser: (req, cb) => {
    const { account, name, email, introduction, password } = req.body
    const userId = req.params.userId
    const { avatarFile, coverFile } = req
    return Promise.all([
      User.findByPk(userId),
      imgurFileHandler(avatarFile),
      imgurFileHandler(coverFile)
    ])
      .then(([user, avatarFilePath, coverFilePath]) => {
        if (!user) throw new Error("User didn't exist!")
        return user.update({
          account,
          name,
          email,
          introduction,
          password,
          avatar: avatarFilePath,
          cover: coverFilePath
        })
      })
      .then(updatedUser => {
        cb(null, { user: updatedUser })
      })
      .catch(err => cb(err))
  },
  addFollowing: (req, cb) => {
    const { id } = req.body
    Promise.all([
      User.findByPk(id),
      Followship.findOne({
        where: {
          followerId: req.user.id,
          followingId: req.body.id
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error("User didn't exist!")
        if (followship) throw new Error('You are already following this user!')
        return Followship.create({
          followerId: req.user.id,
          followingId: userId
        })
      })
      .then(followship => {
        cb(null, { status: 'success', followship })
      })
      .catch(err => cb(err))
  },
  removeFollowing: (req, cb) => {
    Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
      .then(followship => {
        if (!followship) throw new Error("You haven't followed this user!")
        return followship.destroy()
      })
      .then(deletedFollowship => cb(null, { status: 'success', deletedFollowship }))
      .catch(err => cb(err))
  },
  getUserFollowings: (req, cb) => {
    const userId = req.params.userId
    User.findByPk(userId, {
      include: [{ model: User, as: 'Following' }]
    })
  },
  getUserFollowers: (req, cb) => {
    const userId = req.params.userId
    Followship.findAll()
  },
  getUserTweets: (req, cb) => {
    const userId = req.params.userId
    Tweet.findAll({ where: { userId }, include: [User] })
      .then(tweets => {
        cb(null, tweets)
      })
  },
  getUserReplies: (req, cb) => {
    const userId = req.params.userId
    Reply.findAll({ where: { userId }, include: [User] })
      .then(replies => {
        cb(null, replies)
      })
  },
  getLikedTweets: (req, cb) => {
    const userId = req.params.userId
    Like.findAll({ where: { userId }, include: [Tweet] })
      .then(likedTweets => {
        cb(null, likedTweets)
      })
  }
}
module.exports = userServices

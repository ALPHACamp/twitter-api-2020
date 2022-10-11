const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User, Tweet, Reply, Like, Followship, sequelize } = require('../models')
const { Op } = require('sequelize')
const { getUser } = require('../_helpers')
const { imgurFileHandler } = require('../helpers/file-helper')

const userServices = {
  signUp: (req, cb) => {
    // 密碼輸入不一致
    if (req.body.password !== req.body.checkPassword) throw new Error('Passwords do not match!')
    return User.findOne({
      where: { [Op.or]: [{ account: req.body.account }, { email: req.body.email }] }
    })
      .then(user => {
        // 錯誤處理: user已註冊
        if (user) {
          if (user.account === req.body.account) throw new Error('Account already exists!')
          if (user.email === req.body.email) throw new Error('Email already exists!')
        }
        // user未註冊過
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        account: req.body.account,
        email: req.body.email,
        password: hash,
        role: 'user'
      }))
      .then(newUser => cb(null, { newUser }))
      .catch(err => cb(err))
  },
  signIn: (req, cb) => {
    try {
      const userData = getUser(req).toJSON()
      if (userData.role !== 'user') throw new Error('user permission denied')
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      return cb(null, {
        status: 'success',
        message: '成功登入',
        token,
        user: userData
      })
    } catch (err) {
      cb(err)
    }
  },
  getTweets: (req, cb) => {
    return Tweet.findAll({
      where: {
        UserId: req.params.id
      },
      include: User,
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(tweets => cb(null, tweets))
      .catch(err => cb(err))
  },
  getUser: (req, cb) => {
    return User.findByPk(req.params.id, {
      attributes: [
        'id', 'account', 'name', 'email', 'password'
      ]
    })
      .then(user => {
        if (!user) {
          const err = new Error("User didn't exist!")
          err.status = 404
          throw err
        }
        return cb(null, user)
      })
      .catch(err => cb(err))
  },
  putUser: (req, cb) => {
    if (Number(req.params.id) !== Number(req.user.id)) {
      const err = new Error('User not authorized to edit.')
      err.status = 404
      throw err
    }
    const { file } = req
    return Promise.all([
      User.findByPk(req.params.id),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User didn't exist.")
        return user.update({
          account: req.body.account,
          name: req.body.name,
          email: req.body.email,
          introduction: req.body.introduction,
          avatar: filePath || user.avatar
        })
      })
      .then(user => {
        return cb(null, user)
      })
      .catch(err => cb(err))
  },
  getRepliedTweets: (req, cb) => {
    // tweetId, userId, repliedId 看見某使用者發過回覆的推文
    return Promise.all([User.findByPk(req.params.id), Reply.findAll({
      where: {
        UserId: req.params.id
      },
      include: Tweet,
      raw: true,
      nest: true,
      order: [['createdAt', 'DESC']]
    })])
      .then(([user, replies]) => {
        if (!user) throw new Error("User didn't exist.")
        return cb(null, replies)
      })
      .catch(err => cb(err))
  },
  getLikes: (req, cb) => {
    // 看見某使用者點過 Like的推文(text)
    return Promise.all([
      User.findByPk(req.params.id),
      Like.findAll({
        where: {
          UserId: req.params.id
        }
      })
    ])
      .then(([user, likedTweet]) => {
        if (!user) {
          const err = new Error("User didn't exist!")
          err.status = 404
          throw err
        }
        return cb(null, likedTweet)
      })
      .catch((err) => cb(err))
  },
  getFollowings: (req, cb) => {
    // 看見某使用者跟隨中的人
    return Promise.all([
      User.findByPk(req.params.id),
      Followship.findAll({
        where: {
          followerId: req.params.id
        }
      })
    ])
      .then(([user, following]) => {
        if (!user) throw new Error("User didn't exist.")
        if (!following) throw new Error("This user isn't following anyone.")
        return cb(null, following)
      })
      .catch(err => cb(err))
  },
  getFollowers: (req, cb) => {
    return Promise.all([
      User.findByPk(req.params.id),
      Followship.findAll({
        where: {
          followingId: req.params.id
        }
      })
    ])
      .then(([user, follower]) => {
        if (!user) throw new Error("User didn't exist.")
        if (!follower) throw new Error('This user has no followers.')
        return cb(null, follower)
      })
      .catch(err => cb(err))
  }
}

module.exports = userServices

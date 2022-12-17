const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../models')
const helpers = require('../_helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { User, Followship, Tweet, Reply, Like } = db

const userController = {
  register: (req, res, next) => {
    if (req.body.password !== req.body.checkPassword) throw new Error('Passwords do not match!')
    if (req.body.password.length > 8) throw new Error('Passwords should be no more than 8 digit!')
    if (req.body.account.length > 8) throw new Error('Account should be no more than 8 digit!')
    if (!req.body.email.includes('@')) throw new Error('your email address does not have @')
    Promise.all([
      User.findOne({ where: { account: req.body.account } }),
      User.findOne({ where: { email: req.body.email } })
    ])
      .then(([userByAccount, userByEmail]) => {
        if (userByAccount) throw new Error('Account already exists!')
        if (userByEmail) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        account: req.body.account,
        name: req.body.name,
        email: req.body.email,
        password: hash,
        role: 'user'
      }))
      .then(newUser => {
        const data = { user: newUser }
        res.json({ status: 'success', data })
      })
      .catch(err => next(err))
  },
  login: (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      if (userData.role !== 'user') throw new Error('Admin account cannot enter front-end!')
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  getUser: (req, res, next) => {
    return Promise.all([
      User.findByPk(req.params.id),
      Followship.findOne({
        where: {
          followerId: helpers.getUser(req), // 6 測試用DB裡面的6和下面的4即可得到true
          followingId: req.params.id // 4
        }
      }),
      Followship.findAndCountAll({ where: { followerId: helpers.getUser(req) } }),
      Followship.findAndCountAll({ where: { followingId: helpers.getUser(req) } })
    ])
      .then(([user, followship, followerCount, followingCount]) => {
        user = user.toJSON()
        user.isSelf = Number(req.params.id) === Number(helpers.getUser(req).id)
        user.isfollow = followship !== null
        user.followingAmount = followerCount.count
        user.followerAmount = followingCount.count
        res.status(200).json(user)
      })
      .catch(err => next(err))
  },
  getUserTweets: (req, res, next) => {
    return Tweet.findAll({
      // raw: true,
      // nest: true,
      where: {
        UserId: req.params.id
      },
      include: [Reply, Like, User],
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        tweets = tweets.map(tweet => {
          return {
            id: tweet.id,
            UserId: tweet.UserId,
            description: tweet.description,
            userAccount: tweet.User.account,
            userName: tweet.User.name,
            avatar: tweet.User.avatar,
            createdAt: tweet.createdAt,
            updatedAt: tweet.updatedAt,
            likedAmount: tweet.Likes.length,
            repliedAmount: tweet.Replies.length,
            isLike: tweet.Likes.map(t => t.id).includes(helpers.getUser(req).id)
          }
        })
        res.status(200).json(tweets)
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    if (Number(req.params.id) !== helpers.getUser(req).id) throw new Error('permission denied.')
    const { name, introduction } = req.body
    const { files } = req
    const nameMax = 50
    const introMax = 160
    const avatar = files?.avatar ? files.avatar[0] : null
    const background = files?.background ? files.background[0] : null
    return Promise.all([
      User.findByPk(req.params.id),
      imgurFileHandler(avatar),
      imgurFileHandler(background)
    ])
      .then(([user, avatar, background]) => {
        if (!user) throw new Error("User didn't exist!")
        if (name.length > nameMax) throw new Error('the length of name should be under 50.')
        if (introduction.length > introMax) throw new Error('the length of introduction should be under 160.')
        return user.update({
          name,
          introduction,
          avatar: avatar || user.avatar,
          background: background || user.background
        })
      })
      .then(user => {
        // const user = updatedUser.toJSON()
        res.status(200).json(user)
      })
      .catch(err => next(err))
  },
  putUserSetting: (req, res, next) => {

  },

}
module.exports = userController

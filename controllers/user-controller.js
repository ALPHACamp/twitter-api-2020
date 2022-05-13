const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User, Tweet, Reply, Like } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signIn: (req, res, next) => {
    if (req.user.role === 'admin') throw new Error("Admin doen't have permission!") // admin 不能登入
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
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
    return User.findOne({
      where: { id: req.params.id, role: 'user' },
      include: [
        { model: User, as: 'Followers', attributes: ['id', 'account', 'avatar', 'name'] },
        { model: User, as: 'Followings', attributes: ['id', 'account', 'avatar', 'name'] }
      ],
      order: [['createdAt', 'DESC']]
    })
      .then(user => {
        if (!user) throw new Error("User doen't have permission!")
        user = user.toJSON()
        delete user.password
        return res.json({
          status: 'success',
          statusCode: 200,
          data: {
            user,
            followerCount: user.Followers.length,
            followingCount: user.Followings.length
          },
          message: ''
        })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    if (Number(req.params.id) !== Number(req.user.id)) {
      throw new Error("User doen't have permission!")
    }
    const { account, name, password, email, introduction } = req.body
    const hash = bcrypt.hashSync(password, 10)
    const { avatar } = req
    const { cover } = req
    if (!name) throw new Error('User name is required!')
    if (!account) throw new Error('Account is required!')
    if (!password) throw new Error('Password is required!')
    if (!email) throw new Error('Email is required!')
    if (account !== req.user.account && User.findOne({ where: { account } })) throw new Error('Account has already been take.')
    if (email !== req.user.email && User.findOne({ where: { email } })) throw new Error('Email has already been take.')
    imgurFileHandler(avatar)
    imgurFileHandler(cover)
    return User.findByPk(req.params.id)
      .then(user => {
        user.update({
          name, account, email, password: hash, avatar: avatar || null, cover: cover || null, introduction
        })
        user = user.toJSON()
        delete user.password
        return res.json({
          status: 'success',
          data: {
            user
          }
        })
      })
      .catch(err => next(err))
  },
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      where: { userId: req.params.id },
      include: [{
        model: Reply,
        as: 'Replies',
        attributes: ['id']
      }, {
        model: Like,
        as: 'Likes',
        attributes: ['id']
      }],
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        if (!tweets) throw new Error('This account does not exist.')
        const resultTweets = tweets.map(t => ({ ...t.toJSON(), replyCount: t.Replies.length, likeCount: t.Likes.length }))
        return res.json({
          status: 'success',
          data: {
            tweets: resultTweets
          }
        })
      }).catch(err => next(err))
  }
}
module.exports = userController

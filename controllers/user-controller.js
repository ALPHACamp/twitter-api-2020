const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User } = require('../models')
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
          name, account, email, password: hash, avatar: avatar || null, cover, introduction
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
  }
}
module.exports = userController

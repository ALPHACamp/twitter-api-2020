const jwt = require('jsonwebtoken')
const { User, Tweet, Reply, Like } = require('../models')
const helpers = require('../_helpers')
const bcrypt = require('bcryptjs')


const adminController = {
  signIn: (req, res, next) => {
    try {
      if (helpers.getUser(req) && helpers.getUser(req).role !== 'admin') {
        return res.status(403).json({ status: 'error', message: "此帳號不存在!" })
      }
      
      const userData = helpers.getUser(req).toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        },
        message: '成功登入！'
      })
    } catch (err) {
      next(err)
    }
  },
  getUsers: (req, res, next) => {
    User.findAll({
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Reply, include: Tweet },
        { model: Like, include: Tweet }
      ]
    })
      .then(users => {
        users = users.map(user => ({
          ...user.toJSON(),
          followerCount: user.Followers.length,
          followingCount: user.Followings.length,
          replyCount: user.Replies.length,
          likeCount: user.Likes.length
        }))
        return res.status(200).json(users)
      })
      .catch(err => next(err))
  }

}

module.exports = adminController

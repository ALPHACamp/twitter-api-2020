const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sequelize = require('sequelize')
const { User, Tweet, Followship } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userServices = {
  signIn: async (req, cb) => {
    try {
      const { email, password } = req.body
      if (!email || !password) {
        const err = new Error('請輸入帳號密碼')
        err.status = 400
        throw err
      }
      const user = await User.findOne({ where: { email } })
      if (!email) {
        const err = new Error('帳號密碼輸入錯誤')
        err.status = 400
        throw err
      }
      if (user.role === 'admin') {
        const err = new Error('帳號不存在')
        err.status = 404
        throw err
      }
      if (!bcrypt.compareSync(password, user.password)) {
        const err = new Error('帳號密碼輸入錯誤')
        err.status = 400
        throw err
      }
      const userData = user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      return cb(null, {
        status: 'success',
        message: '登入成功！',
        token,
        user: userData
      })
    } catch (err) {
      cb(err)
    }
  },
  getUser: async (req, cb) => {
    try {
      const { id } = req.params
      const user = await User.findByPk(id, {
        attributes: [
          'id',
          'email',
          'account',
          'name',
          'avatar',
          'banner',
          [
            sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)'),
            'followersCount'
          ],
          [
            sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followerId = User.id)'),
            'followingsCount'
          ],
          [
            sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId IN (SELECT id FROM Tweets WHERE Tweets.UserId = User.id))'),
            'likesCount'
          ],
          [
            sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id)'),
            'tweetsCount'
          ]
        ],
        raw: true,
        nest: true
      })
      if (!user) {
        const err = new Error('使用者不存在')
        err.status = 404
        throw err
      }
      if (user.email === 'root@example.com') {
        const err = new Error('使用者不存在')
        err.status = 404
        throw err
      }
      cb(null, user)
    } catch (err) {
      cb(err)
    }
  },
  putUser: async (req, cb) => {
    try {
      const { name, introduction } = req.body
      const { id } = req.params
      const { files } = req
      if (!id === req.user.id) {
        const err = new Error('無權修改')
        err.status = 403
        throw err
      }
      const user = await User.findByPk(id)
      if (!user) {
        const err = new Error('使用者不存在')
        err.status = 404
        throw err
      }
      if (name.length >= 50) {
        const err = new Error('名稱不可超過50字')
        err.status = 400
        throw err
      }
      if (introduction.length >= 160) {
        const err = new Error('名稱不可超過50字')
        err.status = 400
        throw err
      }
      const filePath = await imgurFileHandler(files)
      const updateUser = await user.update({
        name,
        introduction,
        avatar: filePath[0] || user.avatar,
        banner: filePath[1] || user.banner
      })
      const userData = updateUser.toJSON()
      delete userData.password
      cb(null, userData)
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = userServices

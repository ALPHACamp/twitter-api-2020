const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { Op } = require('sequelize')
const { User, Tweet, Reply } = require('../models')
const helpers = require('../_helpers')

const userController = {
  signUp: (req, res, next) => {
    const { password, checkPassword, email, account, name } = req.body
    const [nameMin, nameMax] = [1, 50]

    if (password !== checkPassword) throw new Error('密碼與確認密碼不相符')

    User.findOne({
      attributes: ['email', 'account'],
      where: {
        [Op.or]: [{ email }, { account }]
      }
    })
      .then(user => {
        if (!user) return bcrypt.hash(password, 10)
        if (name.length < nameMin || name.length > nameMax) throw new Error(`暱稱字數限制需在 ${nameMin}~ ${nameMax} 字之內`)
        if (user.email === email) throw new Error('該Email已被註冊！')
        if (user.account === account) throw new Error('該account已被註冊！')
      })
      .then(hash => User.create({
        name,
        account,
        email,
        role: 'user',
        password: hash,
        profilePhoto: 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png',
        coverPhoto: 'https://i.imgur.com/t0YRqQH.jpg'
      }))
      .then(newUser => res.json({ status: 'success', data: { user: newUser } }))
      .catch(err => next(err))
  },
  signIn: (req, res, next) => {
    try {
      const userData = helpers.getUser(req)?.toJSON()
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
  getUserProfile: (req, res, next) => {
    const id = Number(req.params.id)
    User.findByPk(id, { raw: true })
      .then(user => {
        if (!user) throw new Error('該使用者不存在')
        delete user.password
        return res.json({ status: 'success', data: { user } })
      })
      .catch(err => next(err))
  },
  putUserProfile: (req, res, next) => {
    const id = Number(req.params.id)
    const userId = helpers.getUser(req)?.id
    const { name, introduction } = req.body
    const { file } = req
    const [nameMin, nameMax] = [1, 50]
    const [introductionMin, introductionMax] = [1, 160]

    return Promise.all([
      User.findByPk(id),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (userId !== id) throw new Error('不具有權限')
        if (name.length < nameMin || name.length > nameMax) throw new Error(`暱稱字數限制需在 ${nameMin}~ ${nameMax} 字之內`)

        if (introduction.length < introductionMin || introduction.length > introductionMax) throw new Error(`自我介紹字數限制需在 ${introductionMin}~ ${introductionMax} 字之內`)

        return user.update({
          name,
          introduction,
          profilePhoto: filePath || user.profilePhoto,
          coverPhoto: filePath || user.coverPhoto
        })
      })
      .then(updateUser => {
        const user = updateUser.toJSON()
        delete user.password
        res.json(
          {
            status: 'success',
            message: '使用者資料編輯成功！',
            data: { user }
          }
        )
      })
      .catch(err => next(err))
  },
  getUserTweets: (req, res, next) => {
    const currentUserId = helpers.getUser(req)?.id // 當前登入使用者id
    const UserId = Number(req.params.id) // 動態路由取得的id
    let id // 最後要拿來查詢的id
    if (currentUserId === UserId) {
      id = currentUserId
    } else {
      id = UserId
    }
    Promise.all([User.findByPk(id), Tweet.findAll({ where: { UserId: id } })])
      .then(([user, tweets]) => {
        if (!user) throw new Error('使用者不存在')
        res.json(tweets)
      })
      .catch(err => next(err))
  },
  getUserReplies: (req, res, next) => {
    const currentUserId = req.user.id
    // const currentUserId = helpers.getUser(req)?.id // 當前登入使用者id
    const UserId = Number(req.params.id) // 動態路由取得的id
    let id // 最後要拿來查詢的id
    if (currentUserId === UserId) {
      id = currentUserId
    } else {
      id = UserId
    }
    Reply.findAll({ where: { UserId: id } })
      .then(replies => {
        res.json(replies)
      })
  }
}

module.exports = userController

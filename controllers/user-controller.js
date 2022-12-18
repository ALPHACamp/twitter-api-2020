const bcrypt = require('bcryptjs')
const { User, sequelize } = require('../models')
const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')
const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      if (userData.role !== 'user') {
        throw new Error('帳號不存在')
      }
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
  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      // 初始化message物件
      const message = {}
      if (password !== checkPassword) return res.status({ status: 'error', message: '密碼與確認密碼不一致' })
      // 查詢資料庫帳號與信箱是否已註冊
      const [userAccount, userEmail] = await Promise.all([
        User.findOne({ where: { account } }),
        User.findOne({ where: { email } })
      ])

      if (userAccount) message.account = '帳號已註冊!'
      if (userEmail) message.email = '信箱已註冊!'

      // 若有任一錯誤，接回傳錯誤訊息及原填載資料
      if (Object.keys(message).length !== 0) {
        return res.status(422).json({
          status: 'error',
          message,
          account,
          name,
          email
        })
      }

      // 建立新使用者
      const newUser = await User.create({
        account,
        name,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
        role: 'user',
        cover: 'https://loremflickr.com/1500/800/mountain'
      })

      // 回傳新使用者資料，刪除password欄位
      const userData = newUser.toJSON()
      delete userData.password
      return res.json({
        status: 'success',
        user: userData
      })
    } catch (err) {
      next(err)
    }
  },
  getUser: (req, res, next) => {
    const id = Number(req.params.id)
    return User.findByPk(id, {
      // include: [
      // Tweet,
      //  { model: User, as: 'Followers' },
      //  { model: User, as: 'Followings' }
      // ],
      where: { id, role: 'user' },
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt'],
        include: [
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.following_id = User.id)'), 'followerCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.follower_id = User.id)'), 'followingCount']
        ]
      }
    })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        if (user.role === 'admin') throw new Error('帳號不存在！')
        const { ...userData } = {
          ...user.toJSON()
        }
        return res.json({ ...userData })
      })
      .catch(err => next(err))
  }
}
module.exports = userController

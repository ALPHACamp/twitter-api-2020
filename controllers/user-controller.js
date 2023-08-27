const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')
const { User } = require('../models')

const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })// 簽發 JWT Token(期限30天)
      return res.status(200).json({
        token,
        user: userData
      })
    } catch (err) {
      return next(err)
    }
  },
  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      if (!name || !account || !email || !password || !checkPassword) throw new Error('所有欄位皆為必填！')
      if (name.length > 50) throw new Error('名稱字數超出上限！')
      if (password !== checkPassword) throw new Error('密碼與確認密碼不符合！')
      const [userEmail, userName] = await Promise.all([
        User.findOne({ where: { email } }),
        User.findOne({ where: { account } })
      ])
      if (userEmail) throw new Error('email已重複註冊！')
      if (userName) throw new Error('account已重複註冊！')

      const hash = await bcrypt.hash(password, 10)
      const newUser = await User.create({
        name,
        account,
        email,
        role: 'user',
        password: hash,
        avatar: 'htps://i.imgur.com/uSgVo9G.png',
        cover: 'https://i.imgur.com/7uwf8kO.png'
      })
      const userData = newUser.toJSON()
      delete userData.password
      return res.json({
        status: 'success',
        data: { user: userData }
      })
    } catch (err) {
      return next(err)
    }
  },
  getUser: async (req, res, next) => {
    try {
      const UserId = req.params.id // 被查看的使用者ID
      const isFollowed = helpers.getUser(req).Followings.some(f => f.id.toString() === UserId) || [] // 檢查用戶是否有被使用者追蹤
      const currentUserId = helpers.getUser(req).id.toString() // 用戶ID
      const isCurrentUser = currentUserId === UserId // 判斷是否是使用者本人
      const user = await User.findByPk(UserId, {
        attributes: { exclude: ['password'] },
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })
      if (!user || (user.role === 'admin')) {
        const err = new Error('使用者不存在！')
        err.status = 404
        throw err
      }
      const result = {
        ...user.toJSON(),
        followersCount: user.Followers.length,
        followingsCount: user.Followings.length,
        isCurrentUser,
        isFollowed
      }
      delete result.Followers
      delete result.Followings
      return res.json(result)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController

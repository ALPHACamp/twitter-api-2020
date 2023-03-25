const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const validator = require('validator')

const helpers = require('../_helpers')

const { User, Tweet, Reply, Followship, sequelize } = require('../models')

const userController = {
  signIn: async (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: '30d'
      })
      return res.json({
        status: 'success',
        message: '登入成功!',
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
      const errors = []

      // check if all the required fields are filled out correctly
      if (!account || !name || !email || !password || !checkPassword) {
        errors.push('所有欄位皆必填')
      }
      if (name && !validator.isByteLength(name, { max: 50 })) {
        errors.push('字數超出上限，請將字數限制在 50 字以內')
      }
      if (password && !validator.isByteLength(password, { min: 8, max: 20 })) {
        errors.push(
          '密碼長度介於 8 ~ 20 字元'
        )
      }
      if (password !== checkPassword) {
        errors.push('密碼與確認密碼不相符')
      }
      if (email && !validator.isEmail(email)) {
        errors.push('請輸入有效的 email 格式')
      }

      // Check if account and email are unique
      const [userAccount, userEmail] = await Promise.all([
        User.findOne({ where: { account } }),
        User.findOne({ where: { email } })
      ])
      if (userAccount) errors.push('帳號已重複註冊！')
      if (userEmail) errors.push('Email已重複註冊！')

      // Return error message if there are errors
      if (errors.length) {
        return res.status(400).json({ status: 'error', errors })
      }

      // Hash password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      // Create user in DB
      await User.create({
        account,
        name,
        email,
        password: hashedPassword
      })

      return res
        .status(200)
        .json({ status: 'success', message: '註冊成功！' })
    } catch (err) {
      next(err)
    }
  },
  getRepliedTweets: async (req, res, next) => {
    try {
      const { userId } = req.params
      const reply = await Reply.findAll({
        where: { UserId: userId },
        include: [
          { model: User, attributes: ['name'] },
          {
            model: Tweet,
            include: [{ model: User, attributes: ['name', 'account', 'createdAt'] }]
          }
        ],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })
      if (!reply) throw new Error('回覆不存在')
      return res.status(200).json(reply)
    } catch (error) { return res.status(500).json({ status: 'error', message: error }) }
  },
  getFollowers: (req, res, next) => {
    return User.findAll({
      where: { id: req.params.userId },
      include: [
        { model: User, as: 'Followers', attributes: ['id', 'avatar', 'name', 'introduction'] }],
    })
      .then(followerData => {
        if (!followerData) throw new Error('用戶不存在')
        followerData = followerData.map((f) => ({
          ...f.toJSON().Followers,
          followerId: f.Followers.id,
          followerAvatar: f.Followers?.avatar || 'https://reurl.cc/XLQeQj',
          followerName: f.Followers?.name,
          followerIntro: f.Followers?.introduction || '',
          followerCount: f.Followers.length,
          isFollowed: helpers
            .getUser(req)
            .Followings.some(
              (fu) => fu.Followship.followingId === f.Followers.id
            )
        }))
        return res.status(200).json(followerData)
      })
      .catch(error => next(error))
  }
}

module.exports = userController

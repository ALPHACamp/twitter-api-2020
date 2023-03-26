const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const validator = require('validator')

const helpers = require('../_helpers')

const { User, Tweet, Reply } = require('../models')

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
  getUserReplies: async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id

      const user = await User.findByPk(userId)
      if (!user) {
        return res.status(404).json({ status: 'error', message: '找不到使用者' })
      }

      const replies = await Reply.findAll({
        where: { UserId: userId },
        include: [
          { model: User, attributes: ['name', 'avatar', 'account'] },
          {
            model: Tweet,
            include: User
          }
        ],
        order: [['createdAt', 'DESC']]
      })

      if (replies.length === 0) {
        return res.status(404).json({
          status: 'error',
          message: '找不到任何回覆'
        })
      }

      const repliesData = replies.map((reply) => {
        return {
          Id: reply.id,
          UserId: reply.UserId,
          comment: reply.comment,
          CreatedAt: reply.createdAt,
          Name: reply.User.name,
          Avatar: reply.User.avatar,
          Account: reply.User.account,
          tweetId: reply.TweetId,
          tweetDescription: reply.Tweet.description,
          tweetCreatedAt: reply.Tweet.createdAt,
          tweetAuthorId: reply.Tweet.User.id,
          tweetAuthorAccount: reply.Tweet.User.account
        }
      })

      return res.status(200).json(repliesData)
    } catch (err) {
      next(err)
    }
  },
  getFollowings: (req, res, next) => {
    const { userId } = req.params
    return User.findAll({
      where: { id: userId },
      include: [{ model: User, as: 'Followings' }],
      raw: true
    })
      .then((user) => {
        console.log(...user)
        if (!user || user.role === 'admin') {
          return res.status(404).json({ status: 'error', message: '帳戶不存在' })
        };
        const followingData = user.map((user) => ({
          ...user,
          userId: user.id,
          name: user.name,
          account: user.account,

          followingId: user.Followings?.id || null,
          followingAvatar: user.Followings?.avatar || 'https://reurl.cc/XLQeQj',
          followingName: user.Followings?.name || 'anonymous user',
          followingIntro: user.Followings?.introduction || '',
          followingCount: user.Followings.length,
          isFollowed: helpers
            .getUser(req)
            .Followings.some(
              (fu) => fu.Followship.followingId === user.Followers.id
            )

        }))
        console.log(user.Followings)
        console.log(followingData)
        return res.status(200).json(followingData)
      })
      .catch((error) => next(error))
  }
}

module.exports = userController

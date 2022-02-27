const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')
const { User, Tweet, Like, Reply } = require('../models')
const { Op } = require("sequelize");


module.exports = {
  signin: (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()

      switch (true) {
        case (req.originalUrl === '/api/signin' && userData.role !== 'user'):
          throw new Error('帳號不存在！')

        case (req.originalUrl === '/api/admin/signin' && userData.role !== 'admin'):
          throw new Error('帳號不存在！')

        default:
          delete userData.password
          const token = jwt.sign(
            userData, process.env.JWT_SECRET, { expiresIn: '30d' }
          )

          const responseData = { token, user: userData }
          return res.json(responseData)
      }

    } catch (err) { next(err) }
  },

  signup: async (req, res, next) => {
    try {
      // if no any following property within req.body,
      // then just return null instead
      const account = req.body?.account?.trim() || null
      const name = req.body.name?.trim() || null
      const email = req.body.email?.trim() || null
      const password = req.body.password?.trim() || null
      const checkPassword = req.body?.checkPassword?.trim() || null

      if (!account || !name || !email || !password || !checkPassword) {
        throw new Error('每個欄位都屬必填!')
      }

      if (name.length > 50) {
        throw new Error('name 不得超過50字!')
      }

      if (password !== checkPassword) {
        throw new Error('密碼欄位必須一致!')
      }

      // in order to handle two exceptions,
      // it's necessary to do two queries to database
      const [userForAccount, userForEmail] = await Promise.all([
        User.findOne({ where: { account }, raw: true }),
        User.findOne({ where: { email }, raw: true })
      ])
      if (userForAccount) throw new Error('account 已重複註冊！')
      if (userForEmail) throw new Error('email 已重複註冊！')

      // hash password with bcrypt.js
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)

      // create user in database
      const user = await User.create({
        account, name, email, password: hash
      })

      // retrieve complete user data from database
      const responseData = await User.findByPk(user.toJSON().id, { raw: true })
      delete responseData.password

      return res.status(200).json(responseData)

    } catch (err) { next(err) }
  },
  getUser: async (req, res, next) => {
    try {
      const { UserId } = req.params

      const responseData = await User.findByPk(UserId, {
        attributes: { exclude: ['password'] }, raw: true
      })

      return res.status(200).json(responseData)

    } catch (err) {
      next(err)
    }
  },
  getTweetsOfUser: async (req, res, next) => {
    try {
      const { UserId } = req.params

      const responseData = await Tweet.findAll({
        where: { UserId }, raw: true
      })

      if (!responseData.length) throw new Error('沒有任何推文!')

      return res.status(200).json(responseData)

    } catch (err) {
      next(err)
    }
  },
  putUser: async (req, res, next) => {
    // account edit : account name email password checkPassword 
    // profile edit : name introduction cover avatar
    try {
      const selfUserId = helpers.getUser(req).id
      const UserId = Number(req.params.UserId)

      const { account, name, email, password, checkPassword, introduction } = req.body

      // check UserId and word length
      if (selfUserId !== UserId) throw new Error('無法編輯其他使用者資料')
      if (introduction?.length > 160 || name?.length > 50) {
        throw new Error('字數超出上限！')
      }

      // find user and count with account & email
      const users = await User.findAll({
        where: { [Op.or]: [{ id: UserId }, { account }, { email }] },
        attributes: { exclude: ['password'] },
        limit: 4
      })

      // check repeat if edit account or email
      if (account && email && password) {
        // match password 
        if (password != checkPassword) throw new Error('密碼欄位必須一致!')

        // check repeat
        const repeatCount = users.reduce((counter, user) => {
          if (user.account === account) counter.account++
          if (user.email === email) counter.email++
          return counter
        }, { account: 0, email: 0 })

        // throw email or account error
        if (repeatCount.account > 1 && repeatCount.email > 1) {
          throw new Error('account 和 email 已重覆！')
        }
        if (repeatCount.account > 1) throw new Error('account 已重覆！')
        if (repeatCount.email > 1) throw new Error('email 已重覆！')
      }

      // find self user and update
      const user = users.find(user => user.id = UserId)
      const updatedUser = await user.update(req.body)
      const responseData = updatedUser.toJSON()

      return res.status(200).json(responseData)

    } catch (err) {
      next(err)
    }
  },
  getLikedTweets: async (req, res, next) => {
    try {
      const { UserId } = req.params

      const responseData = await Like.findAll({
        where: { UserId },
        include: [{ model: Tweet }],
        order: [['createdAt', 'DESC']],
        nest: true
      })

      return res.status(200).json(responseData)

    } catch (err) {
      next(err)
    }
  },
  getRepliedTweets: async (req, res, next) => {
    try {
      const { UserId } = req.params
      const replies = await Reply.findAll({
        where: { UserId },
        include: [{
          model: Tweet,
          include: [{ model: User, attributes: { exclude: ['password'] } }]
        }],
        order: [['createdAt', 'DESC']],
        nest: true
      })

      const responseData = replies.map(reply => {
        reply = reply.toJSON()

        // assign following two objects to reply
        reply.repliedTweet = reply.Tweet
        reply.repliedTweet.TweetedUser = reply.Tweet.User

        // remove unnecessary key properties
        delete reply.Tweet
        delete reply.repliedTweet.User

        return reply
      })

      return res.status(200).json(responseData)

    } catch (err) {
      next(err)
    }
  }
}
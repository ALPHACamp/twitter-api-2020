const passport = require('passport')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')
const { User, Tweet, Reply, Like, sequelize } = require('../models')
const { Sequelize, QueryTypes, Op } = require('sequelize')
const { valueTrim } = require('../helpers/obj-helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signin: [
    passport.authenticate('local', {
      session: false
    }),
    (req, res, next) => {
      try {
        // 登入完後要發出jwt token
        const token = jwt.sign(helpers.getUser(req), process.env.JWT_SECRET, { expiresIn: '1d' }) // expiresIn: token的有效日期是一天
        res.status(200).json({
          token,
          user: helpers.getUser(req)
        })
      } catch (err) {
        next(err)
      }
    }
  ],
  signup: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = valueTrim(req.body)
      if (!account || !name || !email || !password || !checkPassword) throw new Error('所有欄位皆不可為空白')
      if (name.length > 50) throw new Error('名稱不可超過50字')
      if (password !== checkPassword) throw new Error('密碼與確認密碼不符')
      const [isAccountExist, isEmailExist] = await Promise.all([
        User.findOne({ where: { role: 'user', account }, attributes: ['id'], raw: true }),
        User.findOne({ where: { role: 'user', email }, attributes: ['id'], raw: true })
      ])
      if (isAccountExist) throw new Error('account 已重複註冊！')
      if (isEmailExist) throw new Error('email 已重複註冊！')
      const user = await User.create({
        role: 'user',
        avatar: 'https://i.imgur.com/TGuHpHB.jpg',
        cover: 'https://i.imgur.com/vzIPCvD.png',
        account,
        name,
        email,
        password: bcrypt.hashSync(password, 10)
      })
      res.status(200).json(user)
    } catch (err) {
      next(err)
    }
  },
  getUser: async (req, res, next) => {
    try {
      const { id } = req.params
      const data = await User.findByPk(id, {
        attributes: { exclude: ['password', 'role'] },
        include: [
          { model: User, as: 'Followers', attributes: ['id'] },
          { model: User, as: 'Followings', attributes: ['id'] },
          { model: Tweet, attributes: ['id'] }
        ]
      })
      if (!data) throw new Error('查無此使用者')
      const signinUser = helpers.getUser(req)
      const user = {
        ...data.toJSON(),
        tweets: data.Tweets.length,
        followers: data.Followers.length,
        followings: data.Followings.length,
        isMyself: signinUser.id === Number(id),
        isFollowing: signinUser ? signinUser.Followings.some(following => following.id === Number(id)) : false
      }
      delete user.Tweets
      delete user.Followers
      delete user.Followings
      res.status(200).json(user)
    } catch (err) {
      next(err)
    }
  },
  editUserProfile: async (req, res, next) => {
    try {
      const signinUser = helpers.getUser(req)
      const { id } = req.params
      if (signinUser.id !== Number(id)) throw new Error('無編輯權限')
      const { name, introduction } = valueTrim(req.body)
      if (!name) throw new Error('名稱不可為空白')
      if (name.length > 50) throw new Error('名稱不可超過50字')
      if (introduction?.length > 160) throw new Error('自我介紹不可超過160字')
      const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] }
      })
      if (!user) throw new Error('使用者不存在')
      const images = (!req.files) ? null : await imgurFileHandler(req.files) // 回傳為物件，{avatar: '...', cover: '...'}
      const editedUser = await user.update({
        name: name || user.toJSON().name,
        introduction: introduction || user.toJSON().introduction,
        avatar: images ? images.avatar : user.toJSON().avatar,
        cover: images ? images.cover : user.toJSON().cover
      })
      res.status(200).json(editedUser)
    } catch (err) {
      next(err)
    }
  },
  editUserAccount: async (req, res, next) => {
    try {
      const signinUser = helpers.getUser(req)
      const { id } = req.params
      if (signinUser.id !== Number(id)) throw new Error('無編輯權限')
      const { account, name, email, password, checkPassword } = valueTrim(req.body)
      if (!account || !name || !email) throw new Error('帳號、名稱、Email不可為空白')
      if (name.length > 50) throw new Error('名稱不可超過50字')
      if (password !== checkPassword) throw new Error('密碼與確認密碼不符')
      const [existAccount, existEmail, user] = await Promise.all([
        User.findOne({ where: { role: 'user', account }, attributes: ['id'], raw: true }),
        User.findOne({ where: { role: 'user', email }, attributes: ['id'], raw: true }),
        User.findByPk(id)
      ])
      if (existAccount && existAccount.id !== Number(id)) throw new Error('account 已重複註冊！')
      if (existEmail && existEmail.id !== Number(id)) throw new Error('email 已重複註冊！')
      if (!user) throw new Error('使用者不存在')

      const editedUser = await user.update({
        account,
        name,
        email,
        password: (password !== '') ? bcrypt.hashSync(password, 10) : user.toJSON().password
      })
      res.status(200).json(editedUser)
    } catch (err) {
      next(err)
    }
  },
  getUserTweets: async (req, res, next) => {
    try {
      const userId = req.params.id
      const user = await User.findByPk(userId, { raw: true, attributes: ['id'] })
      if (!user) throw new Error('使用者不存在')
      const data = await Tweet.findAll({
        where: { userId },
        attributes: ['id', 'description', 'updatedAt'],
        order: [['updatedAt', 'DESC']],
        include: [
          { model: Reply, attributes: ['id'] },
          { model: Like, attributes: ['id'] }
        ]
      })
      const signinUser = helpers.getUser(req)
      const userTweets = data.map(el => {
        const tweet = {
          ...el.toJSON(),
          replies: el.Replies?.length,
          likes: el.Likes?.length,
          isLike: signinUser.Likes ? signinUser.Likes.some(like => like.TweetId === el.id) : false
        }
        delete tweet.Replies
        delete tweet.Likes
        return tweet
      })
      res.status(200).json(userTweets)
    } catch (err) {
      next(err)
    }
  },
  getUserReplies: async (req, res, next) => {
    try {
      const userId = req.params.id
      const user = await User.findByPk(userId, { raw: true, attributes: ['id'] })
      if (!user) throw new Error('使用者不存在')
      const data = await Reply.findAll({
        where: { userId },
        order: [['updatedAt', 'DESC']],
        attributes: ['comment', 'updatedAt'],
        include: [
          {
            model: Tweet,
            attributes: ['id'],
            include: [{ model: User, attributes: ['id', 'name'] }]
          }
        ]
      })
      const userReplies = data.map(el => {
        const reply = {
          ...el.toJSON(),
          tweeterId: el.Tweet.User.id,
          tweeterName: el.Tweet.User.name
        }
        delete reply.Tweet
        return reply
      })
      res.status(200).json(userReplies)
    } catch (err) {
      next(err)
    }
  },
  getUserLikes: async (req, res, next) => {
    try {
      const userId = req.params.id
      const user = await User.findByPk(userId, { raw: true, attributes: ['id'] })
      if (!user) throw new Error('使用者不存在')
      const data = await Like.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'TweetId', 'createdAt'],
        include: [
          {
            model: Tweet,
            include: [
              { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
              { model: Reply, attributes: ['id'] },
              { model: Like, attributes: ['id'] }
            ]
          }
        ]
      })
      const signinUser = helpers.getUser(req)
      const userLikes = data.map(el => {
        const userLike = {
          ...el.toJSON(),
          tweeterId: el.Tweet.User.id,
          account: el.Tweet.User.account,
          name: el.Tweet.User.name,
          avatar: el.Tweet.User.avatar,
          description: el.Tweet.description,
          replies: el.Tweet.Replies?.length,
          likes: el.Tweet.Likes?.length,
          isLike: signinUser.Likes ? signinUser.Likes.some(like => like.TweetId === el.TweetId) : false
        }
        delete userLike.Tweet
        return userLike
      })
      res.status(200).json(userLikes)
    } catch (err) {
      next(err)
    }
  },
  getUserFollowers: async (req, res, next) => {
    try {
      const followingId = req.params.id
      const user = await User.findByPk(followingId)
      if (!user) throw new Error('使用者不存在')
      const data = await sequelize.query(
        `
        SELECT followerId, name, avatar, introduction
        FROM followships JOIN users ON users.id = followships.followerId
        WHERE followingId = ?
        ORDER BY followships.createdAt DESC
        `,
        {
          replacements: [followingId],
          raw: true,
          type: QueryTypes.SELECT
        }
      )
      const signinUser = helpers.getUser(req)
      const followers = data.map(el => ({
        ...el,
        isFollowing: signinUser && signinUser.Followings.some(following => following.id === el.followerId)
      }))
      res.status(200).json(followers)
    } catch (err) {
      next(err)
    }
  },
  getUserFollowings: async (req, res, next) => {
    try {
      const followerId = req.params.id
      const user = await User.findByPk(followerId)
      if (!user) throw new Error('使用者不存在')
      const data = await sequelize.query(
        `
        SELECT followingId, name, avatar, introduction
        FROM followships JOIN users ON users.id = followships.followingId
        WHERE followerId = ?
        ORDER BY followships.createdAt DESC
        `,
        {
          replacements: [followerId],
          raw: true,
          type: QueryTypes.SELECT
        }
      )
      const signinUser = helpers.getUser(req)
      const followings = data.map(el => ({
        ...el,
        isFollowing: signinUser && signinUser.Followings.some(following => following.id === el.followingId)
      }))
      res.status(200).json(followings)
    } catch (err) {
      next(err)
    }
  },
  getFollowersRank: async (req, res, next) => {
    try {
      const order = req.query.order || 'DESC'
      const limit = Number(req.query.limit) || 10
      const signinUser = helpers.getUser(req)
      const data = await User.findAll({
        where: {
          role: { [Op.eq]: 'user' },
          id: { [Op.ne]: signinUser.id }
        },
        attributes: {
          include: [
            [
              Sequelize.literal('(SELECT COUNT(*) FROM followships AS followship WHERE followship.followingId = user.id)'),
              'followers'
            ]
          ],
          exclude: ['email', 'cover', 'introduction', 'role', 'password', 'createdAt', 'updatedAt']
        },
        order: [
          [Sequelize.literal('followers'), order],
          ['id', 'ASC']
        ],
        limit
      })
      const users = data.map(el => ({
        ...el.toJSON(),
        isFollowing: signinUser && signinUser.Followings.some(following => following.id === el.id)
      }))
      res.status(200).json(users)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController

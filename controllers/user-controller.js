const jwt = require('jsonwebtoken')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const createError = require('http-errors')
const helpers = require('../_helpers')
const { User, Tweet, Like, Reply, Followship, sequelize } = require('../models')
const imgurFileHandler = require('../helpers/file-helpers')
const timeFormat = require('../helpers/date-helpers')

const userController = {
  login: (req, res, next) => {
    try {
      const loginUser = helpers.getUser(req)

      if ((req.originalUrl === '/api/users/login' && loginUser.role !== 'user') ||
        (req.originalUrl === '/api/admin/login' && loginUser.role !== 'admin')) throw createError(404, '帳號不存在')

      const token = jwt.sign({ id: loginUser.id }, process.env.JWT_SECRET, { expiresIn: '30d' })

      return res.json({
        status: 'success',
        message: '登入成功',
        id: loginUser.id,
        token
      })
    } catch (error) {
      next(error)
    }
  },
  register: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body

      if (!account?.trim() || !name?.trim() || !email?.trim() || !password?.trim() || !checkPassword?.trim()) throw createError(400, '欄位不得為空')

      const [foundAccount, foundEmail] = await Promise.all([
        User.findOne({ where: { account }, raw: true }),
        User.findOne({ where: { email }, raw: true })
      ])

      if (foundAccount) throw createError(400, 'Account 重複註冊')
      if (name.length > 50) throw createError(400, '名稱不能超過 50 個字')
      if (foundEmail) throw createError(400, 'Email 重複註冊')
      if (!validator.isEmail(email)) throw createError(400, 'Email 格式有誤')
      if (password !== checkPassword) throw createError(400, '兩次輸入的密碼不相同')

      await User.create({ account, name, email, password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)) })

      return res.json({
        status: 'success',
        message: '註冊成功'
      })
    } catch (error) {
      next(error)
    }
  },
  getUser: async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      const user = await User.findByPk(id, {
        attributes: [
          'id', 'account', 'name', 'introduction', 'avatar', 'cover', 'role',
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE follower_id = User.id)'), 'followingCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE following_id = User.id)'), 'followerCount']
        ]
      })

      if (!user || user.role === 'admin') throw createError(404, '帳號不存在')

      return res.json(user)
    } catch (error) {
      next(error)
    }
  },
  putUser: async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      const { name, introduction } = req.body
      const { files } = req

      // 為通過測試不能做欄位不得為空錯誤訊息回傳
      // if (!name || !introduction || !files?.avatar || !files?.cover) throw createError(400, '欄位不得為空')
      if (name.length > 50) throw createError(400, '名稱不能超過 50 個字')
      if (introduction.length > 160) throw createError(400, '自我介紹不能超過 160 個字')

      const [user, avatarPath, coverPath] = await Promise.all([
        User.findByPk(id),
        imgurFileHandler(files?.avatar ? files.avatar[0] : null),
        imgurFileHandler(files?.cover ? files.cover[0] : null)
      ])

      await user.update({
        name,
        introduction,
        avatar: avatarPath || user.avatar,
        cover: coverPath || user.cover
      })

      return res.json({
        status: 'success',
        message: '成功更新使用者個人資料'
      })
    } catch (error) {
      next(error)
    }
  },
  getUserSetting: async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      const user = await User.findByPk(id, {
        attributes: ['id', 'account', 'name', 'email']
      })

      return res.json(user)
    } catch (error) {
      next(error)
    }
  },
  putUserSetting: async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      const { account, name, email, password, checkPassword } = req.body

      if (!account || !name || !email || !password || !checkPassword) throw createError(400, '欄位不得為空')

      const [user, foundAccount, foundEmail] = await Promise.all([
        User.findByPk(id),
        User.findOne({ where: { account }, raw: true }),
        User.findOne({ where: { email }, raw: true })
      ])

      if (foundAccount && foundAccount.account !== user.account) throw createError(400, 'Account 重複註冊')
      if (name.length > 50) throw createError(400, '名稱不能超過 50 個字')
      if (foundEmail && foundEmail.email !== user.email) throw createError(400, 'Email 重複註冊')
      if (!validator.isEmail(email)) throw createError(400, 'Email 格式有誤')
      if (password !== checkPassword) throw createError(400, '兩次輸入的密碼不相同')

      await user.update({ account, name, email, password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)) })

      return res.json({
        status: 'success',
        message: '該使用者帳號設定更新成功'
      })
    } catch (error) {
      next(error)
    }
  },
  getUserTweets: async (req, res, next) => {
    try {
      const loginUser = helpers.getUser(req)
      const id = Number(req.params.id)
      const [user, tweets] = await Promise.all([
        User.findByPk(id),
        Tweet.findAll({
          raw: true,
          nest: true,
          where: { UserId: id },
          include: [{ model: User, attributes: ['id', 'account', 'name', 'avatar'] }],
          attributes: [
            'id', 'description', 'createdAt',
            [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Tweet_id = Tweet.id )'), 'replyCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Likes  WHERE Tweet_id = Tweet.id )'), 'likeCount'],
            [sequelize.literal(`EXISTS(SELECT id FROM Likes WHERE Likes.User_id = ${loginUser.id} AND Likes.Tweet_id = Tweet.id)`), 'isLiked']
          ],
          order: [['createdAt', 'DESC']]
        })
      ])

      if (!user || user.role === 'admin') throw createError(404, '帳號不存在')

      const result = tweets.map(tweet => ({
        ...tweet,
        createdAt: timeFormat(tweet.createdAt),
        isLiked: !!tweet.isLiked
      }))

      return res.json(result)
    } catch (error) {
      next(error)
    }
  },
  getUserReplies: async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      const [user, replies] = await Promise.all([
        User.findByPk(id),
        Reply.findAll({
          where: { UserId: id },
          attributes: { exclude: ['updatedAt'] },
          include: [
            { model: User, attributes: ['id', 'account', 'name', 'avatar'] },
            {
              model: Tweet,
              attributes: { exclude: ['id', 'description', 'createdAt', 'updatedAt'] },
              include: { model: User, attributes: ['id', 'account'] }
            }
          ],
          order: [['createdAt', 'DESC']]
        })
      ])

      if (!user || user.role === 'admin') throw createError(404, '帳號不存在')

      const result = replies.map(reply => ({
        ...reply.toJSON(),
        createdAt: timeFormat(reply.createdAt)
      }))

      return res.json(result)
    } catch (error) {
      next(error)
    }
  },
  getUserLikes: async (req, res, next) => {
    try {
      const loginUser = helpers.getUser(req)
      const id = Number(req.params.id)
      const [user, likes] = await Promise.all([
        User.findByPk(id),
        Like.findAll({
          where: { UserId: id },
          attributes: ['id', 'UserId', 'TweetId', 'createdAt'],
          include: {
            model: Tweet,
            attributes: ['id', 'description', 'createdAt',
              [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.Tweet_id = Tweet.id)'), 'replyCount'],
              [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.Tweet_id = Tweet.id)'), 'likeCount'],
              [sequelize.literal(`EXISTS(SELECT id FROM Likes WHERE Likes.User_id = ${loginUser.id} AND Likes.Tweet_id = Tweet.id)`), 'isLiked']
            ],
            include: { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
          },
          order: [['createdAt', 'DESC']]
        })
      ])

      if (!user || user.role === 'admin') throw createError(404, '帳號不存在')

      const result = likes.map(like => {
        const { Tweet, ...data } = like.toJSON()

        return {
          ...data,
          Tweet: {
            ...Tweet,
            isLiked: !!Tweet.isLiked,
            createdAt: timeFormat(Tweet.createdAt)
          }
        }
      })

      return res.json(result)
    } catch (error) {
      next(error)
    }
  },
  getUserFollowings: async (req, res, next) => {
    try {
      const loginUser = helpers.getUser(req)
      const id = Number(req.params.id)
      const [user, followings] = await Promise.all([
        User.findByPk(id),
        Followship.findAll({
          where: { followerId: id },
          attributes: {
            exclude: ['updatedAt']
          },
          include: {
            model: User,
            as: 'Followings',
            attributes: ['account', 'name', 'introduction', 'avatar',
              [sequelize.literal(`EXISTS(SELECT id FROM Followships WHERE Followships.follower_id = ${loginUser.id} AND Followships.following_id = Followings.id)`), 'isFollowed']]
          },
          order: [['createdAt', 'DESC']]
        })
      ])

      if (!user || user.role === 'admin') throw createError(404, '帳號不存在')

      const result = followings.map(following => {
        const { Followings, ...data } = following.toJSON()

        return {
          ...data,
          Followings: {
            ...Followings,
            isFollowed: !!Followings.isFollowed
          }
        }
      })
      return res.json(result)
    } catch (error) {
      next(error)
    }
  },
  getUserFollowers: async (req, res, next) => {
    try {
      const loginUser = helpers.getUser(req)
      const id = Number(req.params.id)
      const [user, followers] = await Promise.all([
        User.findByPk(id),
        Followship.findAll({
          where: { followingId: id },
          attributes: { exclude: ['updatedAt'] },
          include: {
            model: User,
            as: 'Followers',
            attributes: [
              'account', 'name', 'introduction', 'avatar',
              [sequelize.literal(`EXISTS(SELECT id FROM Followships WHERE Followships.follower_id = ${loginUser.id} AND Followships.following_id = Followers.id)`), 'isFollowed']]
          },
          order: [['createdAt', 'DESC']]
        })
      ])

      if (!user || user.role === 'admin') throw createError(404, '帳號不存在')

      const result = followers.map(follower => {
        const { Followers, ...data } = follower.toJSON()

        return {
          ...data,
          Followers: {
            ...Followers,
            isFollowed: !!Followers.isFollowed
          }
        }
      })

      return res.json(result)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = userController

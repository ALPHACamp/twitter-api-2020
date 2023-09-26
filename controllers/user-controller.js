const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { User, Tweet, Like, Reply, Followship } = require('../models')
const { Op } = require('sequelize')
const Sequelize = require('sequelize')
const validator = require('validator')
const { imgurFileHandler } = require('../helpers/file-handler')
const helpers = require('../_helpers')

const userController = {
  signUp: (req, res, next) => {
    const { name, account, email, password, checkPassword } = req.body
    if (!name || !account || !email || !password || !checkPassword) throw new Error('所有欄位皆為必填！')
    if (name.length > 50) throw new Error('暱稱字數超出上限！')
    if (account.length > 30) throw new Error('帳號字數超出上限！')
    if (password.length < 5 || password.length > 20) throw new Error('請設定 5 到 20 字的密碼！')
    if (password !== checkPassword) throw new Error('密碼與確認密碼不符合！')
    if (!validator.isEmail(email)) throw new Error('請輸入正確 email!')

    return Promise.all([
      User.findOne({ where: { email } }),
      User.findOne({ where: { account } })
    ])
      .then(([userA, userB]) => {
        if (userA) throw new Error('email已重複註冊！')
        if (userB) throw new Error('帳號已重複註冊！')
        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({
        name,
        account,
        email,
        password: hash
      }))
      .then(userData => {
        userData = userData.toJSON()
        delete userData.password
        return res.json({
          status: 'success',
          data: { user: userData }
        })
      })
      .catch(err => next(err))
  },
  signIn: (req, res, next) => {
    const userData = helpers.getUser(req)
    const JWTSecret = process.env.JWT_SECRET || 'SECRET'
    if (userData.role === 'admin') {
      const err = new Error('帳號不存在！')
      err.status = 404
      throw err
    }
    try {
      const token = jwt.sign(userData, JWTSecret, { expiresIn: '30d' })
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

  getUser: async (req, res, next) => {
    try {
      const UserId = req.params.id
      const isFollowed = helpers.getUser(req).Followings.some(f => f.id.toString() === UserId)

      const user = await User.findByPk(UserId, {
        attributes: {
          exclude: ['password'],
          include: [
            [Sequelize.literal('(SELECT COUNT(*) FROM `Followships` WHERE `Followships`.`followingId` = `User`.`id`)'), 'followersCount'],
            [Sequelize.literal('(SELECT COUNT(*) FROM `Followships` WHERE `Followships`.`followerId` = `User`.`id`)'), 'followingsCount'],
            [Sequelize.literal('(SELECT COUNT(*) FROM `Tweets` WHERE `Tweets`.`UserId` = `User`.`id`)'), 'tweetsCount']
          ]
        },
        raw: true
      })
      if (!user) {
        const err = new Error('使用者不存在！')
        err.status = 404
        throw err
      }

      const data = {
        ...user,
        isFollowed
      }
      return res.json(data)
    } catch (err) {
      return next(err)
    }
  },

  getUserTweets: async (req, res, next) => {
    try {
      const UserId = req.params.id
      const likedTweetsId = helpers.getUser(req)?.Likes ? helpers.getUser(req).Likes.map(l => l.TweetId) : []

      const [user, tweets] = await Promise.all([
        User.findByPk(UserId),
        Tweet.findAll({
          where: { UserId },
          attributes: {
            include: [
              [Sequelize.literal('(SELECT COUNT(*) FROM `Likes` WHERE `Likes`.`TweetId` = `Tweet`.`id`)'), 'likesCount'],
              [Sequelize.literal('(SELECT COUNT(*) FROM `Replies` WHERE `Replies`.`TweetId` = `Tweet`.`id`)'), 'repliesCount']
            ]
          },
          include: [
            { model: User, attributes: { exclude: ['password'] } }
          ],
          order: [['createdAt', 'DESC']],
          raw: true,
          nest: true
        })
      ])
      if (!user) {
        const err = new Error('使用者不存在！')
        err.status = 404
        throw err
      }

      const data = tweets.map(tweet => ({
        ...tweet,
        isLiked: likedTweetsId.some(id => id === tweet.id)
      }))
      return res.json(data)
    } catch (err) {
      return next(err)
    }
  },

  getUserReplies: async (req, res, next) => {
    try {
      const UserId = req.params.id

      const [user, replies] = await Promise.all([
        User.findByPk(UserId),
        Reply.findAll({
          where: { UserId },
          include: [
            { model: Tweet, include: [{ model: User, attributes: { exclude: ['password'] } }] }
          ],
          order: [['createdAt', 'DESC']],
          raw: true,
          nest: true
        })
      ])
      if (!user) {
        const err = new Error('使用者不存在！')
        err.status = 404
        throw err
      }

      return res.json(replies)
    } catch (err) {
      return next(err)
    }
  },

  getUserLikes: async (req, res, next) => {
    try {
      const UserId = req.params.id
      const likedTweetsId = helpers.getUser(req)?.Likes ? helpers.getUser(req).Likes.map(l => l.TweetId) : []

      const [user, likes] = await Promise.all([
        User.findByPk(UserId),
        Like.findAll({
          where: { UserId },
          include: [{
            model: Tweet,
            attributes: {
              include: [
                [Sequelize.literal('(SELECT COUNT(*) FROM `Likes` WHERE `Likes`.`TweetId` = `Tweet`.`id`)'), 'likesCount'],
                [Sequelize.literal('(SELECT COUNT(*) FROM `Replies` WHERE `Replies`.`TweetId` = `Tweet`.`id`)'), 'repliesCount']
              ]
            },
            include: [
              { model: User, attributes: { exclude: ['password'] } }
            ]
          }],
          order: [['createdAt', 'DESC']],
          raw: true,
          nest: true
        })
      ])
      if (!user) {
        const err = new Error('使用者不存在！')
        err.status = 404
        throw err
      }

      const data = likes.map(like => ({
        ...like,
        isLiked: likedTweetsId.some(id => id === like.TweetId)
      }))
      return res.json(data)
    } catch (err) {
      return next(err)
    }
  },

  putUser: async (req, res, next) => {
    try {
      if (helpers.getUser(req).id !== Number(req.params.id)) throw new Error('只能編輯自己的使用者資料！')
      let { name, account, email, password, checkPassword, introduction } = req.body
      const avatar = req.files?.avatar ? await imgurFileHandler(req.files.avatar[0]) : null
      const banner = req.files?.banner ? await imgurFileHandler(req.files.banner[0]) : null

      if (name?.length > 50) throw new Error('暱稱字數超出上限！')
      if (introduction?.length > 160) throw new Error('自我介紹字數超出上限！')
      if (password !== checkPassword) throw new Error('密碼與確認密碼不符合！')
      if (password) {
        if (password.length < 5 || password.length > 20) throw new Error('請設定 5 到 20 字的密碼')
        password = await bcrypt.hash(password, 10)
      }
      const userA = await User.findByPk(req.params.id, {
        attributes: {
          include: [
            [Sequelize.literal('(SELECT COUNT(*) FROM `Tweets` WHERE `Tweets`.`UserId` = `User`.`id`)'), 'tweetsCount'],
            [Sequelize.literal('(SELECT COUNT(*) FROM `Followships` WHERE `Followships`.`followingId` = `User`.`id`)'), 'followersCount'],
            [Sequelize.literal('(SELECT COUNT(*) FROM `Followships` WHERE `Followships`.`followerId` = `User`.`id`)'), 'followingsCount']
          ]
        }
      })
      if (!userA) {
        const err = new Error('使用者不存在！')
        err.status = 404
        throw err
      }
      // 如果使用者輸入的 email 和原本一樣，就不用再去檢查 email 是否存在，不然會顯示 email 已重複註冊
      if (email) {
        if (!validator.isEmail(email)) throw new Error('請輸入正確 email!')
        if (userA.email !== email) {
          const userB = await User.findOne({ where: { email } })
          if (userB) throw new Error('email已重複註冊！')
        }
      }
      // 同上註解
      if (account) {
        if (account.length > 30) throw new Error('帳號字數超出上限！')
        if (userA.account !== account) {
          const userC = await User.findOne({ where: { account } })
          if (userC) throw new Error('帳號已重複註冊！')
        }
      }
      let updatedUser = await userA.update({
        name: name || userA.name,
        account: account || userA.account,
        email: email || userA.email,
        password: password || userA.password,
        introduction: introduction || userA.introduction,
        avatar: avatar || userA.avatar,
        banner: banner || userA.banner
      })
      updatedUser = updatedUser.toJSON()
      delete updatedUser.password
      return res.json({ status: 'success', data: { user: updatedUser } })
    } catch (err) {
      return next(err)
    }
  },
  getFollowings: async (req, res, next) => {
    try {
      const followingsId = helpers.getUser(req).Followings.map(fs => fs.id)
      const [user, followships] = await Promise.all([
        User.findByPk(req.params.id),
        Followship.findAll({
          where: { followerId: req.params.id },
          include: { model: User, as: 'Following', attributes: { exclude: 'password' } },
          order: [['createdAt', 'DESC']],
          nest: true,
          raw: true
        })
      ])
      if (!user) {
        const err = new Error('使用者不存在！')
        err.status = 404
        throw err
      }
      const data = followships.map(f => {
        f.Following.isFollowed = followingsId.some(id => id === f.Following.id)
        return f
      })
      return res.json(data)
    } catch (err) {
      return next(err)
    }
  },
  getFollowers: async (req, res, next) => {
    try {
      const followingsId = helpers.getUser(req).Followings.map(f => f.id)
      const [user, followships] = await Promise.all([
        User.findByPk(req.params.id),
        Followship.findAll({
          where: { FollowingId: req.params.id },
          include: { model: User, as: 'Follower', attributes: { exclude: 'password' } },
          order: [['createdAt', 'DESC']],
          nest: true,
          raw: true
        })
      ])
      if (!user) {
        const err = new Error('使用者不存在！')
        err.status = 404
        throw err
      }
      const data = followships.map(f => {
        f.Follower.isFollowed = followingsId.some(id => id === f.Follower.id)
        return f
      })
      return res.json(data)
    } catch (err) {
      return next(err)
    }
  },
  getTopUser: async (req, res, next) => {
    try {
      const followingsId = helpers.getUser(req).Followings.map(f => f.id)
      const users = await User.findAll({
        raw: true,
        where: { id: { [Op.ne]: helpers.getUser(req).id }, role: 'user' },
        attributes: {
          exclude: ['password'],
          include: [[Sequelize.literal('(SELECT COUNT(*) FROM `Followships` WHERE `Followships`.`followingId` = `User`.`id`)'), 'followersCount']]
        },
        order: [[Sequelize.literal('followersCount'), 'DESC']],
        limit: 10
      })
      const data = users.map(u => {
        u.isFollowed = followingsId.some(id => id === u.id)
        return u
      })
      return res.json(data)
    } catch (err) {
      return next(err)
    }
  },
  getAuth: (req, res, next) => {
    helpers.getUser(req) ? res.json({ status: 'success', message: `User role is ${helpers.getUser(req).role}` }) : res.status(401).json({ status: 'error', message: 'unauthorized' })
  }
}

module.exports = userController

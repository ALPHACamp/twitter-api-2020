const bcrypt = require('bcryptjs')
const { ImgurClient } = require('imgur')
const client = new ImgurClient({ clientId: process.env.IMGUR_CLIENT_ID })
const { User, Tweet, Like, Reply, Followship } = require('../models')
const { sequelize } = require('../models')
const helpers = require('../_helpers')

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
// const ExtractJwt = passportJWT.ExtractJwt
// const JwtStrategy = passportJWT.Strategy

let userController = {
  signIn: (req, res, next) => {
    if (!req.body.account || !req.body.password) {
      throw new Error('請輸入必填項目')
    }

    User.findOne({
      where: { account: req.body.account }
    })
      .then(user => {
        if (!user) return res.status(401).json({ status: 'error', message: '此使用者尚未註冊' })

        if (!bcrypt.compareSync(req.body.password, user.password)) {
          throw new Error('密碼輸入錯誤')
        }

        var payload = { id: user.id }
        var token = jwt.sign(payload, process.env.JWT_SECRET)
        return res.json({
          status: 'success',
          message: 'ok',
          token: token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            account: user.account,
            role: user.role
          }
        })
      })
      .catch(err => next(err))
  },

  signUp: (req, res, next) => {
    if (!req.body.account || !req.body.password) {
      throw new Error('請輸入必填項目')
    }
    if (req.body.checkPassword !== req.body.password) {
      throw new Error('兩次密碼輸入不同！')
    } else {
      User.findOne({
        where: {
          $or: { email: req.body.email, account: req.body.account }
        }
      })
        .then(user => {
          if (user) {
            if (user.email === req.body.email) {
              throw new Error('信箱重複！')
            }
            if (user.account === req.body.account) {
              throw new Error('帳號重複！')
            }
          } else {
            User.create({
              name: req.body.name,
              email: req.body.email,
              account: req.body.account,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
            }).then(user => {
              return res.json({ status: 'success', message: '成功註冊帳號！' })
            })
          }
        })
        .catch(err => next(err))
    }
  },

  getUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.userId, {
        include: [Tweet, { model: User, as: 'Followings' }, { model: User, as: 'Followers' }],
        order: [[Tweet, 'createdAt', 'DESC']]
      })
      if (!user) throw new Error('找不到使用者')

      return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        account: user.account,
        cover: user.cover,
        avatar: user.avatar,
        introduction: user.introduction,
        followingCount: user.Followings.length,
        followerCount: user.Followers.length
      })
    } catch (error) {
      next(error)
    }
  },

  getUserTweets: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.userId, {
        include: [{ model: Tweet, include: [Like, Reply] }],
        order: [[Tweet, 'createdAt', 'DESC']]
      })
      if (!user) throw new Error('這名使用者不存在或已被刪除')

      const tweets = user.toJSON().Tweets.map(t => ({
        tweetId: t.id,
        userId: t.UserId,
        createdAt: t.createdAt,
        description: t.description.substring(0, 50),
        likeCount: t.Likes.length,
        replyCount: t.Replies.length
      }))

      return res.json(tweets)
    } catch (error) {
      next(error)
    }
  },

  getAllReplies: async (req, res, next) => {
    try {
      const replies = await User.findByPk(req.params.userId, {
        include: Reply,
        order: [[Reply, 'createdAt', 'DESC']]
      })
      if (!replies) throw new Error('這名使用者不存在或已被刪除')

      return res.json(replies.toJSON().Replies)
    } catch (error) {
      next(error)
    }
  },

  getLikes: async (req, res, next) => {
    try {
      const like = await User.findByPk(req.params.userId, {
        attributes: [],
        include: [
          {
            model: Like,
            attributes: { exclude: ['updatedAt'] },
            include: [
              {
                model: Tweet,
                attributes: { exclude: ['updatedAt'] },
                include: [
                  { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
                  { model: Like, attributes: ['TweetId'] },
                  { model: Reply, attributes: ['TweetId'] }
                ]
              }
            ]
          }
        ],
        order: [[Like, 'createdAt', 'DESC']]
      })
      if (!like) throw new Error('這名使用者不存在或已被刪除')

      const data = like.toJSON().Likes.map(d => ({
        userId: d.UserId,
        TweetId: d.TweetId,
        userName: d.Tweet.User.name,
        userAccount: d.Tweet.User.account,
        userAvatar: d.Tweet.User.avatar,
        description: d.Tweet.description.substring(0, 50),
        likeCount: d.Tweet.Likes.length,
        replyCount: d.Tweet.Replies.length
      }))

      res.json(data)
    } catch (error) {
      next(error)
    }
  },

  getFollowings: async (req, res, next) => {
    try {
      const following = await User.findByPk(req.params.userId, {
        attributes: [],
        include: [
          {
            model: User,
            as: 'Followings',
            attributes: [['id', 'followingId'], 'name', 'account', 'avatar', 'introduction'],
            through: { attributes: [] }
          }
        ],
        order: [[sequelize.literal('`Followings->Followship`.`createdAt`'), 'DESC']] // '->' returns JSON object field by key
      })
      if (!following) throw new Error('這名使用者不存在或已被刪除')

      res.json(following.toJSON().Followings)
    } catch (error) {
      next(error)
    }
  },

  getFollowers: async (req, res, next) => {
    try {
      const followers = await User.findByPk(req.params.userId, {
        attributes: [],
        include: [
          {
            model: User,
            as: 'Followers',
            attributes: [['id', 'followerId'], 'name', 'account', 'avatar', 'introduction'],
            through: { attributes: [] }
          }
        ],
        order: [[sequelize.literal('`Followers->Followship`.`createdAt`'), 'DESC']] // '->' returns JSON object field by key
      })
      if (!followers) throw new Error('這名使用者不存在或已被刪除')

      const data = followers.toJSON().Followers.map(d => ({
        ...d,
        isFollowing: helpers
          .getUser(req)
          .Followings.map(f => f.id)
          .includes(d.followerId)
      }))

      res.json(data)
    } catch (error) {
      next(error)
    }
  },

  putUserProfile: async (req, res, next) => {
    let { name, introduction } = req.body
    const { files } = req
    const userId = helpers.getUser(req).id
    const id = Number(req.params.userId)
    const error = []

    if (id !== userId) throw new Error('只能修改自己的 profile')
    if (!name) throw new Error('名字為必填')

    try {
      if (introduction)
        introduction.trim().length > 140 ? error.push('個人介紹最多 140 字') : (introduction = introduction.trim())
      if (name) name.trim().length > 15 ? error.push('名字最多 15 字') : (name = name.trim())
      if (error.length) throw new Error(error)

      const user = await User.findByPk(id)
      if (!user) throw new Error('user not found.')

      const images = {}
      if (files) {
        for (const key in files) {
          // req.files 是一個物件 (String -> Array) 键是文件名，值是文件陣列
          // e.g. req.files['avatar'][0] -> File
          console.log(files[key][0].path)
          images[key] = await client.upload(files[key][0].path)
        }
      }

      // console.log(images.avatar)
      await user.update({
        name,
        introduction,
        avatar: images.avatar ? images.avatar.data.link : user.avatar,
        cover: images.cover ? images.cover.data.link : user.cover
      })

      res.json({ status: 'success', message: 'update successfully' })
    } catch (error) {
      next(error)
    }
  },

  addFollowing: async (req, res, next) => {
    try {
      if (Number(req.body.id) === helpers.getUser(req).id) throw new Error('你無法追蹤自己')
      const isFollowing = await Followship.findOne({
        where: {
          followerId: helpers.getUser(req).id,
          followingId: req.body.id
        }
      })
      if (isFollowing) return res.json({ status: 'success', message: '已追蹤過囉～' })

      await Followship.create({ followerId: helpers.getUser(req).id, followingId: Number(req.body.id) })
      return res.json({ status: 'success', message: '追蹤成功' })
    } catch (error) {
      next(error)
    }
  },

  removeFollowing: async (req, res, next) => {
    if (Number(req.params.userId) === helpers.getUser(req).id) {
      return res.json({ status: 'error', message: '無法取消追蹤自己' })
    }
    try {
      const followship = await Followship.findOne({
        where: { followerId: helpers.getUser(req).id, followingId: req.params.followingId }
      })
      if (!followship) res.json({ status: 'error', message: '已移除 follow' })

      await followship.destroy()
      return res.json({ status: 'success', message: 'unfollow successfully' })
    } catch (error) {
      next(error)
    }
  },

  removeFollowing: async (req, res, next) => {
    if (Number(req.params.userId) === helpers.getUser(req).id) {
      return res.json({ status: 'error', message: '無法取消追蹤自己' })
    }
    try {
      const followship = await Followship.findOne({
        where: { followerId: helpers.getUser(req).id, followingId: req.params.followingId }
      })
      if (!followship) res.json({ status: 'error', message: '已移除 follow' })

      await followship.destroy()
      return res.json({ status: 'success', message: 'unfollow successfully' })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = userController

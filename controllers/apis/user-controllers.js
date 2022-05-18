const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User, Tweet, Followship, Reply, Like } = require('../../models')
const helpers = require('../../_helpers')
const { Sequelize, Op } = require('sequelize')
// const sequelize = new Sequelize('sqlite::memory:')

const userController = {
  signIn: async (req, res, next) => {
    try {
      const userData = helpers.getUser(req)?.toJSON()
      if (userData.Identity.id === 'admin') {
        userData.is_admin = true
      } else {
        userData.is_admin = false
      }
      delete userData.password
      delete userData.Identity
      const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: '30d'
      })
      req.session.token = token
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      if (req.xhr) { return res.json(err) }
      next(err)
    }
  },

  signUp: async (req, res, next) => {
    try {
      const user = await User.findAll({
        where: {
          [Op.or]: [{ account: req.body.account }, { email: req.body.email }]
        }
      })
      if (user) throw new Error('使用者已經存在')

      const password = await bcrypt.hash(req.body.password, 10)
      const registeredUser = await User.create({
        account: req.body.account,
        name: req.body.name,
        email: req.body.email,
        password: password
      })

      const token = jwt.sign(registeredUser.toJSON(), process.env.JWT_SECRET, {
        expiresIn: '30d'
      })
      let userData = await User.findByPk(registeredUser.id)
      userData = userData.toJSON()
      userData.is_admin = false
      delete userData.password

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

  getCurrentUser: (req, res, next) => {
    try {
      const userData = helpers.getUser(req)?.toJSON()
      const { token } = req.session
      if (userData.Identity.id === 'admin') {
        userData.is_admin = true
      } else {
        userData.is_admin = false
      }
      delete userData.password
      delete userData.Identity

      return res.status(200).json({
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
      const me = helpers.getUser(req)
      if (!me) throw new Error('未存取到登入資料')
      let my = await User.findAll({
        where: { id: me.id },
        attributes: ['id', 'account', 'name'],
        include: [
          { model: User, as: 'Follower', attributes: ['id'] }
        ]
      })
      my = JSON.parse(JSON.stringify(my))

      let user = await User.findAll({
        where: { id: req.params.id },
        attributes: ['id', 'account', 'name', 'email', 'role', 'coverImg', 'avatarImg', 'introduction'],
        include: [
          { model: User, as: 'Follower', attributes: ['id', 'name', 'account', 'role', 'avatarImg', 'introduction'] },
          { model: User, as: 'Following', attributes: ['id', 'name', 'account', 'role', 'avatarImg', 'introduction'] }
        ],
        nest: true
      })
      if (!user.length) throw new Error('使用者不存在')
      user = JSON.parse(JSON.stringify(user))

      user[0].is_following = Boolean(
        await Followship.findOne({
          where: {
            follower_id: me.id,
            following_id: req.params.id
          }
        })
      )

      user[0].Follower = user[0].Follower.map(record => {
        const isFollowing = Boolean(my[0].Follower.find(following => following.id === record.id))
        return {
          ...record,
          is_following: isFollowing
        }
      })

      user[0].Following = user[0].Following.map(record => {
        const isFollowing = Boolean(my[0].Follower.find(following => following.id === record.id))
        return {
          ...record,
          is_following: isFollowing
        }
      })

      return res.status(200).json(...user)
    } catch (err) {
      next(err)
    }
  },

  getUserTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        where: { user_id: req.params.id },
        attributes: ['id', 'description', 'user_id', 'created_at', 'updated_at'],
        include: [
          {
            model: User,
            attributes: ['id', 'account', 'name', 'avatarImg', 'role']
          },
          {
            model: Reply,
            attributes: ['id']
          },
          {
            model: Like,
            attributes: ['likeUnlike']
          }
        ],
        order: [['created_at', 'DESC']],
        nest: true
      })

      if (!tweets.length) throw new Error('沒有找到相關資料')

      const data = tweets.map(tweet => {
        const replyTotal = tweet.Replies.length
        const likeTotal = tweet.Likes.filter(item => item.likeUnlike).length
        return {
          ...tweet.toJSON(),
          Replies: replyTotal,
          Likes: likeTotal
        }
      })
      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },

  getUserReplies: async (req, res, next) => {
    try {
      const replies = await Reply.findAll({
        where: { user_id: req.params.id },
        attributes: ['id', 'comment', 'user_id', 'tweet_id', 'created_at', 'updated_at'],
        include: [
          {
            model: User,
            attributes: ['id', 'account', 'name', 'avatarImg', 'role']
          },
          {
            model: Tweet,
            attributes: ['id', 'description', 'user_id'],
            include: [
              {
                model: User,
                attributes: ['id', 'account', 'name', 'avatarImg', 'role']
              }
            ]
          }
        ],
        order: [['created_at', 'DESC']],
        nest: true
      })

      if (!replies.length) throw new Error('沒有找到相關資料')

      return res.status(200).json(replies)
    } catch (err) {
      next(err)
    }
  },

  getUserLikes: async (req, res, next) => {
    try {
      let likes = await Like.findAll({
        where: { user_id: req.params.id },
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'account', 'role', 'avatar_img', 'cover_img']
          },
          {
            model: Tweet,
            attributes: ['id', 'description', 'created_at', 'updated_at'],
            include: [
              {
                model: User,
                attributes: ['id', 'name', 'role', 'account', 'avatar_img']
              },
              {
                model: Reply,
                attributes: ['tweet_id']
              },
              {
                model: Like,
                attributes: ['tweet_id']
              }
            ],
            order: [['created_at', 'DESC']]
          }
        ],
        nest: true
      })

      likes = JSON.parse(JSON.stringify(likes))
      if (!likes.length) throw new Error('沒有找到相關資料')

      const data = likes.map(like => {
        const replyCount = like.Tweet.Replies.length
        like.Tweet.replyCount = replyCount
        const likeCount = like.Tweet.Likes.length
        like.Tweet.likeCount = likeCount
        return like
      })

      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },

  getUserFollowings: async (req, res, next) => {
    try {
      const followings = await Followship.findAll({
        where: { follower_id: req.params.id },
        raw: true
      })
      if (!followings) throw new Error('沒有找到相關資料')

      const myId = helpers.getUser(req)?.id
      if (!myId) throw new Error('未存取到登入資料')

      const myFollowing = await Followship.findAll({
        where: { follower_id: myId },
        raw: true
      })
      const myFollowingId = myFollowing.map(f => f.followingId)

      const data = followings.map(f => {
        const isFollowing = Boolean(myFollowingId.find(m => m === f.followingId))
        return {
          ...f,
          is_following: isFollowing
        }
      })
      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },

  getUserFollowers: async (req, res, next) => {
    try {
      const followers = await Followship.findAll({
        where: { following_id: req.params.id },
        raw: true
      })
      if (!followers) throw new Error('沒有找到相關資料')

      const myId = helpers.getUser(req)?.id
      if (!myId) throw new Error('未存取到登入資料')

      const myFollowing = await Followship.findAll({
        where: { follower_id: myId },
        raw: true
      })
      const myFollowingId = myFollowing.map(f => f.followingId)

      const data = followers.map(f => {
        const isFollowing = Boolean(myFollowingId.find(m => m === f.followerId))
        return {
          ...f,
          is_following: isFollowing
        }
      })
      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },

  editUser: async (req, res, next) => {
    try {
      const { name, introduction } = req.body
      const user = await User.findByPk(req.params.id)
      if (!user) throw new Error('沒有找到相關的使用者資料')

      const { files } = req
      const avatarImg = await helpers.imgurFileHandler(files?.avatar_img?.[0]) || user.avatarImg
      const coverImg = await helpers.imgurFileHandler(files?.cover_img?.[0]) || user.coverImg

      const updatedUser = await user.update({
        name,
        introduction,
        avatarImg,
        coverImg
      })
      const data = updatedUser.toJSON()
      delete data.password
      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },

  editUserAccount: async (req, res, next) => {
    try {
      const { account, name, email } = req.body
      const existedUser = await User.findAll({
        where: {
          [Op.or]: [{ account: req.body.account }, { email: req.body.email }]
        }
      })
      if (existedUser) throw new Error('使用者已經存在')

      const user = await User.findByPk(req.params.id)
      if (!user) throw new Error('沒有找到相關的使用者資料')

      const password = await bcrypt.hash(req.body.password, 10) || user.password
      const updatedUser = await user.update({
        account,
        name,
        email,
        password
      })
      const data = updatedUser.toJSON()
      delete data.password
      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },

  getTopUser: async (req, res, next) => {
    try {
      let users = await (User.findAll({
        nest: true,
        where: { role: 'user' },
        attributes: [
          'id',
          'name',
          'account',
          'avatar_img'
          // [sequelize.fn('COUNT', sequelize.col('User.id')), 'follower_count']
        ],
        include: {
          model: User,
          as: 'Following',
          attributes: [
            'id'
          ]
        }
      }))
      const limit = Number(req.query.limit) || users.length
      users = users.map(user => {
        const followerCount = user.Following.length
        return {
          ...user.toJSON(),
          follower_count: followerCount
        }
      })
      users = users.sort((a, b) => b.follower_count - a.follower_count).slice(0, limit)

      const me = helpers.getUser(req)
      if (!me) throw new Error('未存取到登入資料')
      const my = await User.findAll({
        where: { id: me.id },
        attributes: ['id', 'account', 'name'],
        include: [
          { model: User, as: 'Follower', attributes: ['id'] }
        ]
      })
      const myFollowing = JSON.parse(JSON.stringify(my))[0].Follower

      users = users.map(user => {
        const isFollowing = Boolean(myFollowing.find(following => following.id === user.id))
        return {
          ...user,
          is_following: isFollowing
        }
      })

      return res.status(200).json(users)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController

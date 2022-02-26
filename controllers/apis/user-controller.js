const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const helpers = require('../../_helpers')
const sequelize = require('sequelize')
const { Op } = sequelize
const { imgurFileHandler } = require('../../helpers/file-helpers')
const { User, Tweet, Like, Reply, Followship } = require('../../models')
const appFunc = require('../../services/appFunctions')
const TOKEN_EXPIRES = process.env.TOKEN_EXPIRES || '30m'

const userController = {
  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      if (!account || !name || !email || !password || !checkPassword) throw new Error('account, name, email, password, checkPassword is require!')
      if (password !== checkPassword) throw new Error('Password do not match!')
      const userAccountExisted = await User.findOne({ where: { account } })
      if (userAccountExisted) throw new Error('Account already exists!')
      const userEmailExisted = await User.findOne({ where: { email } })
      if (userEmailExisted) throw new Error('Email already exists!')
      const hash = await bcrypt.hash(password, await bcrypt.genSalt(10))
      const user = await User.create({
        account,
        name,
        email,
        password: hash,
        role: 'user'
      })
      delete user.password
      res.json({
        status: 'success',
        data: {
          user
        }
      })
    } catch (err) {
      next(err)
    }
  },
  signIn: (req, res, next) => {
    const userData = helpers.getUser(req).toJSON()
    try {
      // 非使用者不能登入前台
      if (userData.role !== 'user') throw new Error('Account or Password is wrong!')
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRES })
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
      const userId = Number(helpers.getUser(req).id)
      const id = Number(req.params.id)
      const user = await User.findByPk(id, {
        raw: true,
        nest: true,
        attributes: { exclud: ['password'] }
      })
      if (!user || user.role === 'admin') throw new Error("User didn't exist!")
      const following = await Followship.findAndCountAll({ where: { followerId: id }, raw: true, nest: true })
      const followers = await Followship.findAndCountAll({ where: { followingId: id }, raw: true, nest: true })
      const isFollowing = await appFunc.getUserIsFollowing(userId, id)
      const isUser = Boolean(userId === id)
      if (process.env.NODE_ENV === 'test') {
        res.json(user)
      }
      res.json({
        status: 'success',
        data: {
          user: {
            ...user,
            isFollowing,
            following: following.count,
            followers: followers.count,
            isUser
          }
        }
      })
    } catch (err) {
      next(err)
    }
  },
  putUser: async (req, res, next) => {
    try {
      const { name, introduction } = req.body
      if (!name) throw new Error('name is require!')
      const userId = Number(helpers.getUser(req).id)
      const editId = Number(req.params.id)
      const user = await User.findByPk(editId)
      if (!user || user.role === 'admin') throw new Error("User didn't exist!")
      if (userId !== editId) throw new Error('Only allow edit your own account')
      if (name.length > 50) throw new Error('暱稱不能超過50個字！')
      if (introduction.length > 160) throw new Error('自我介紹不能超過160個字！')
      const { files } = req
      const avatar = files?.avatar ? await imgurFileHandler(files.avatar[0]) : user.avatar
      const cover = files?.cover ? await imgurFileHandler(files.cover[0]) : user.cover

      const editedUser = await user.update({
        name,
        introduction,
        avatar,
        cover
      })
      delete editedUser.password
      res.json({
        status: 'success',
        data: {
          user: editedUser
        }
      })
    } catch (err) {
      next(err)
    }
  },
  putUserAccount: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      if (!account || !name || !email || !password || !checkPassword) throw new Error('account, name, email, password, checkPassword is require!')
      const userId = Number(helpers.getUser(req).id)
      const editId = Number(req.params.id)
      const user = await User.findByPk(editId)
      if (!user || user.role === 'admin') throw new Error("User didn't exist!")
      if (userId !== editId) throw new Error('只能修改自己的資料！')
      if (password !== checkPassword) throw new Error('Password do not match!')
      const userAccountExisted = await User.findOne({
        where: {
          account,
          id: { [Op.ne]: editId }
        }
      })
      if (userAccountExisted) throw new Error('Account already exists!')
      const userEmailExisted = await User.findOne({
        where: {
          email,
          id: { [Op.ne]: editId }
        }
      })
      if (userEmailExisted) throw new Error('Email already exists!')
      const hash = await bcrypt.hash(password, await bcrypt.genSalt(10))
      const editedUser = await user.update({
        account,
        name,
        email,
        password: hash,
        role: 'user'
      })
      delete editedUser.password
      res.json({
        status: 'success',
        data: {
          editedUser
        }
      })
    } catch (err) {
      next(err)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const userId = Number(helpers.getUser(req).id)
      const id = Number(req.params.id)
      const user = await User.findByPk(id)
      if (!user || user.role === 'admin') throw new Error("User didn't exist!")
      const tweets = await Tweet.findAll({
        where: { UserId: id },
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: {
          model: User,
          attributes: ['name', 'account', 'avatar']
        }
      })
      if (process.env.NODE_ENV === 'test') {
        res.json(tweets)
      }
      const resTweets = await Promise.all(tweets.map(async tweet => {
        return await appFunc.resTweetHandler(userId, tweet)
      }))
      res.json({
        status: 'success',
        data: { tweets: resTweets }
      })
    } catch (err) {
      next(err)
    }
  },
  getReplies: async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      const user = await User.findByPk(id)
      if (!user || user.role === 'admin') throw new Error("User didn't exist!")
      const replies = await Reply.findAll({
        where: { UserId: id },
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: {
          model: User,
          attributes: ['name', 'account', 'avatar']
        }
      })
      if (process.env.NODE_ENV === 'test') {
        res.json(replies)
      }
      res.json({
        status: 'success',
        data: { replies }
      })
    } catch (err) {
      next(err)
    }
  },
  getLikes: async (req, res, next) => {
    try {
      const userId = Number(helpers.getUser(req).id)
      const id = Number(req.params.id)
      const user = await User.findByPk(id)
      if (!user || user.role === 'admin') throw new Error("User didn't exist!")
      const likes = await Like.findAll({
        where: { UserId: id },
        raw: true,
        nest: true,
        include: {
          model: Tweet,
          order: [['createdAt', 'DESC']],
          include: {
            model: User,
            attributes: ['name', 'account', 'avatar']
          }
        }
      })
      const tweets = likes.map(like => like.Tweet)
      if (process.env.NODE_ENV === 'test') {
        tweets.map(tweet => {
          tweet.TweetId = tweet.id
          return tweet
        })
        res.json(tweets)
      }
      const resTweets = await Promise.all(tweets.map(async tweet => {
        return await appFunc.resTweetHandler(userId, tweet)
      }))
      res.json({
        status: 'success',
        data: { tweets: resTweets }
      })
    } catch (err) {
      next(err)
    }
  },
  getUserFollowings: async (req, res, next) => {
    try {
      const UserId = req.params.id
      let user = await User.findByPk(UserId, {
        include: [
          {
            model: User,
            as: 'Followings',
            attributes: ['id', 'account', 'name', 'avatar', 'introduction']
          }
        ],
        attributes: {
          exclude: [
            'password'
          ]
        }
      })
      if (!user || user.role === 'admin') throw new Error("User didn't exist!")
      const followingsId = helpers.getUser(req).Followings.map(following => following.id) || []

      user = user.toJSON()
      user.Followings.forEach(following => {
        following.followingId = following.id
        following.isFollowed = followingsId.includes(following.id)
      })
      user = user.Followings.sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)

      if (process.env.NODE_ENV === 'test') {
        res.json(user)
      }
      return res.json({
        status: 'success',
        data: {
          users: user
        }
      })
    } catch (err) {
      next(err)
    }
  },
  getUserFollowers: async (req, res, next) => {
    try {
      const UserId = req.params.id
      let user = await User.findByPk(UserId, {
        include: [
          {
            model: User,
            as: 'Followers',
            attributes: ['id', 'account', 'name', 'avatar', 'introduction']
          }
        ],
        attributes: {
          exclude: [
            'password'
          ]
        }
      })
      if (!user || user.role === 'admin') throw new Error("User didn't exist!")
      const followingsId = helpers.getUser(req).Followings.map(following => following.id) || []

      user = user.toJSON()
      user.Followers.forEach(follower => {
        follower.followerId = follower.id
        follower.isFollowed = followingsId.includes(follower.id)
      })
      user = user.Followers.sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)

      if (process.env.NODE_ENV === 'test') {
        res.json(user)
      }

      return res.json({
        status: 'success',
        data: {
          users: user
        }
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController

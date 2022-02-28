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
      const resUser = user.toJSON()
      delete resUser.password
      res.json({
        status: 'success',
        data: {
          user: resUser
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
        attributes: { exclude: ['password'] }
      })
      if (!user || user.role === 'admin') throw new Error("User didn't exist!")
      const following = await Followship.findAndCountAll({ where: { followerId: id }, raw: true, nest: true })
      const followers = await Followship.findAndCountAll({ where: { followingId: id }, raw: true, nest: true })
      const tweets = await Tweet.findAndCountAll({ where: { UserId: id }, raw: true, nest: true })
      const isFollowing = await appFunc.getUserIsFollowing(userId, id)
      const isUser = Boolean(userId === id)
      if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'travis') {
        res.json(user)
      } else {
        const resUser = appFunc.numToUnitHandler({
          ...user,
          isFollowing,
          tweetCount: tweets.count,
          following: following.count,
          followers: followers.count,
          isUser
        })
        res.json({
          status: 'success',
          data: {
            user: resUser
          }
        })
      }
    } catch (err) {
      next(err)
    }
  },
  getPopularUsers: async (req, res, next) => {
    try {
      const userId = Number(helpers.getUser(req).id)
      const limit = Number(req.query.amount) || 10
      const followList = await User.findAll({
        where: { role: { [Op.ne]: 'admin' } },
        raw: true,
        nest: true,
        attributes: [
          'id',
          'name',
          'account',
          'avatar',
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)'), 'followers']
        ],
        limit
      })
      followList.sort((a, b) => b.followers - a.followers)
      const reUsers = await Promise.all(followList.map(async user => {
        user.isFollowing = await appFunc.getUserIsFollowing(userId, user.id)
        return appFunc.numToUnitHandler(user)
      }))
      res.json({
        status: 'success',
        data: {
          users: reUsers
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
      const avatar = files && files.avatar ? await imgurFileHandler(files.avatar[0]) : user.avatar
      const cover = files && files.cover ? await imgurFileHandler(files.cover[0]) : user.cover

      const editedUser = await user.update({
        name,
        introduction,
        avatar,
        cover
      })
      const resUser = editedUser.toJSON()
      delete resUser.password
      res.json({
        status: 'success',
        data: {
          user: resUser
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
      const resUser = editedUser.toJSON()
      delete resUser.password
      res.json({
        status: 'success',
        data: {
          user: resUser
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
        },
        attributes: [
          'id',
          'UserId',
          'description',
          'createdAt',
          [sequelize.literal('(select count(TweetId) from Replies where TweetId = Tweet.id)'), 'replyCount']
        ]
      })
      if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'travis') {
        res.json(tweets)
      } else {
        const resTweets = await Promise.all(tweets.map(async tweet => {
          return await appFunc.resTweetHandler(userId, tweet)
        }))
        res.json({
          status: 'success',
          data: { tweets: resTweets }
        })
      }
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
        include: [{
          model: Tweet,
          attributes: ['id'],
          include: [{ model: User, attributes: ['account'] }]
        },
        {
          model: User,
          attributes: ['name', 'account', 'avatar']
        }]
      })
      if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'travis') {
        res.json(replies)
      } else {
        const resReplies = appFunc.resRepliesHandler(replies)
        res.json({
          status: 'success',
          data: { replies: resReplies }
        })
      }
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
          attributes: [
            'id',
            'UserId',
            'description',
            'createdAt',
            [sequelize.literal('(select count(TweetId) from Replies where TweetId = Tweet.id)'), 'replyCount']
          ],
          include: {
            model: User,
            attributes: ['name', 'account', 'avatar']
          }
        }
      })
      const tweets = likes.map(like => like.Tweet)
      if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'travis') {
        tweets.map(tweet => {
          tweet.TweetId = tweet.id
          return tweet
        })
        res.json(tweets)
      } else {
        const resTweets = await Promise.all(tweets.map(async tweet => {
          return await appFunc.resTweetHandler(userId, tweet)
        }))
        res.json({
          status: 'success',
          data: { tweets: resTweets }
        })
      }
    } catch (err) {
      next(err)
    }
  },
  getUserFollowings: async (req, res, next) => {
    try {
      const UserId = Number(req.params.id)
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
      user = user.Followings.sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)

      if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'travis') {
        user.forEach(following => {
          following.followingId = following.id
        })
        res.json(user)
      } else {
        user.forEach(following => {
          following.isFollowed = followingsId.includes(following.id)
        })
        return res.json({
          status: 'success',
          data: {
            users: user
          }
        })
      }
    } catch (err) {
      next(err)
    }
  },
  getUserFollowers: async (req, res, next) => {
    try {
      const UserId = Number(req.params.id)
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
      user = user.Followers.sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)

      if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'travis') {
        user.forEach(follower => {
          follower.followerId = follower.id
        })
        res.json(user)
      } else {
        user.forEach(follower => {
          follower.isFollowed = followingsId.includes(follower.id)
        })
        return res.json({
          status: 'success',
          data: {
            users: user
          }
        })
      }
    } catch (err) {
      next(err)
    }
  },
  getCurrentUser: async (req, res, next) => {
    try {
      const userId = Number(helpers.getUser(req).id)
      const user = await User.findById(userId, {
        raw: true,
        attributes: ['id', 'name', 'account', 'avatar']
      })
      res.json({
        status: 'success',
        data: {
          user
        }
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController

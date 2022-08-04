const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')

const { User, Tweet, Reply, Like, Followship } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userServices = {
  signUp: async (req, cb) => {
    try {
      if (req.body.password !== req.body.checkPassword) {
        return cb(Error('Passwords do not match!'))
      }

      if (!req.body.account) {
        return cb(Error('Account is not allowed empty!'))
      }

      if (!req.body.email) {
        return cb(Error('Email is not allowed empty!'))
      }

      const userByAccount = await User.findOne({
        where: {
          account: req.body.account || ''
        }
      })
      if (userByAccount) { // email or account already exists
        return cb(Error('Account already exists!'))
      }

      const userByEmail = await User.findOne({
        where: {
          email: req.body.email || ''
        }
      })
      if (userByEmail) { // email or account already exists
        return cb(Error('Email already exists!'))
      }

      const hash = typeof req.body.password === 'string' ? await bcrypt.hash(req.body.password, 10) : undefined

      const updateData = {}
      req.body.account && (updateData.account = req.body.account)
      typeof req.body.name === 'string' && (updateData.name = req.body.name)
      req.body.email && (updateData.email = req.body.email)
      hash && (updateData.password = hash)

      const newUser = await User.create(updateData)

      const userData = newUser.toJSON()
      delete userData.password
      return cb(null, { user: userData })
    } catch (err) {
      return cb(err)
    }
  },
  signIn: (req, cb) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      return cb(null, { token, user: userData })
    } catch (err) {
      return cb(err)
    }
  },
  getTopUsers: async (req, cb) => {
    try {
      const maxLength = 10
      let users = await User.findAll({
        include: [{ model: User, as: 'Followers' }]
      })

      users = users.map(user => {
        return ({
          id: user.dataValues.id,
          account: user.dataValues.account,
          name: user.dataValues.name,
          avatar: user.dataValues.avatar,
          followerCount: user.Followers.length
        })
      })
      users.sort((a, b) => b.followerCount - a.followerCount)
      users = users.slice(0, maxLength)

      return cb(null, users)
    } catch (err) {
      cb(err)
    }
  },
  getUser: (req, cb) => {
    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error("User didn't exist!")

        const userData = user.toJSON()
        delete userData.password
        return cb(null, { user: userData })
      })
      .catch(err => cb(err))
  },
  putUser: async (req, cb) => {
    try {
      if (req.body.password !== req.body.checkPassword) {
        return cb(Error('Passwords do not match!'))
      }

      const user = await User.findByPk(req.params.id)
      if (!user) return cb(Error("User didn't exist!"))

      if (!req.body.account) {
        return cb(Error('Account is not allowed empty!'))
      }

      if (!req.body.email) {
        return cb(Error('Email is not allowed empty!'))
      }

      const userByAccount = await User.findOne({
        where: {
          account: req.body.account || ''
        }
      })
      if (userByAccount) { // email or account already exists
        if (Number(userByAccount.id) !== Number(user.id)) {
          return cb(Error('Account already exists!'))
        }
      }

      const userByEmail = await User.findOne({
        where: {
          email: req.body.email || ''
        }
      })
      if (userByEmail) { // email or account already exists
        if (Number(userByEmail.id) !== Number(user.id)) {
          return cb(Error('Email already exists!'))
        }
      }

      const avatarFile = req.files?.avatar[0]
      const avatarPath = avatarFile ? await imgurFileHandler(req.files.avatar[0]) : undefined
      const coverFile = req.files?.cover[0]
      const coverPath = coverFile ? await imgurFileHandler(req.files.coverPath[0]) : undefined

      const hash = typeof req.body.password === 'string' ? await bcrypt.hash(req.body.password, 10) : undefined

      const updateData = {}
      req.body.account && (updateData.account = req.body.account)
      typeof req.body.name === 'string' && (updateData.name = req.body.name)
      req.body.email && (updateData.email = req.body.email)
      hash && (updateData.password = hash)
      typeof req.body.introduction === 'string' && (updateData.introduction = req.body.introduction)
      avatarPath && (updateData.avatar = avatarPath)
      coverPath && (updateData.cover = coverPath)

      await user.update(updateData)

      const userData = user.toJSON()
      delete userData.password
      return cb(null, userData)
    } catch (err) {
      return cb(err)
    }
  },
  getUserTweets: async (req, cb) => {
    const UserId = req.params.id
    try {
      const tweets = await Tweet.findAll({
        where: { UserId },
        include: [{ model: User, attributes: ['account', 'name', 'avatar'] }],
        order: [['createdAt', 'DESC']],
        nest: true,
        raw: true
      })

      const results = []
      await Promise.all(tweets.map(async tweet => {
        const TweetId = tweet.id
        const likeCount = await Like.count({ where: { TweetId } })
        const replyCount = await Reply.count({ where: { TweetId } })
        results.push(
          {
            ...tweet,
            likeCount,
            replyCount
          })
      }))
      results.sort((a, b) => b.createdAt - a.createdAt)
      return cb(null, results)
    } catch (err) {
      cb(err)
    }
  },
  getUserReplies: (req, cb) => {
    const UserId = req.params.id
    Reply.findAll({
      where: { UserId },
      include: [{ model: User, attributes: ['account', 'name', 'avatar'] },
        { model: Tweet, include: [{ model: User, attributes: ['id', 'name', 'account'] }] }],
      order: [['createdAt', 'DESC']],
      nest: true,
      raw: true
    })
      .then(replies => cb(null, replies))
      .catch(err => cb(err))
  },
  getUserLikes: async (req, cb) => {
    const UserId = req.params.id
    try {
      const likedTweets = await Like.findAll({
        where: { UserId },
        include: [{ model: Tweet, include: [{ model: User, attributes: ['account', 'name', 'avatar'] }] }],
        order: [['createdAt', 'DESC']],
        nest: true,
        raw: true
      })

      const results = []
      await Promise.all(
        likedTweets.map(async like => {
          const TweetId = like.TweetId
          const likeCount = await Like.count({ where: { TweetId } })
          const replyCount = await Reply.count({ where: { TweetId } })
          results.push({ ...like, Tweet: { ...like.Tweet, likeCount, replyCount } })
        })
      )
      results.sort((a, b) => b.createdAt - a.createdAt)
      return cb(null, results)
    } catch (err) {
      return cb(err)
    }
  },
  removeFollowing: async (req, cb) => {
    try {
      const followerId = Number(req.user.dataValues.id)
      const followingId = Number(req.params.followingId)
      const followship = await Followship.findOne({
        where: {
          followerId,
          followingId
        }
      })
      if (!followship) {
        throw new Error("You haven't followed this user!")
      }
      await followship.destroy()

      const followings = await Followship.findAll(
        { where: { followerId: followerId } }
      )
      return cb(null, followings)
    } catch (err) {
      return cb(err)
    }
  },
  addFollowing: async (req, cb) => {
    try {
      const followerId = Number(req.user.dataValues.id)
      const followingId = Number(req.body.id)
      const [followingUser, followship] = await Promise.all([
        User.findByPk(followingId),
        Followship.findOne({
          where: {
            followerId,
            followingId
          }
        })
      ])

      if (!followingUser) throw new Error("User didn't exist!")
      if (followship) throw new Error('You are already following this user!')

      await Followship.create({
        followerId,
        followingId
      })

      const followings = await Followship.findAll(
        { where: { followerId: followerId } }
      )

      return cb(null, followings)
    } catch (err) {
      return cb(err)
    }
  },
  getUserFollowings: async (req, cb) => {
    try {
      const userId = req.params.id
      const user = await User.findByPk(userId,
        {
          include: [{
            model: User,
            as: 'Followings',
            attributes: ['id', 'avatar', 'account', 'name', 'introduction']
          }]
        }
      )

      const results = user.Followings.map(following => {
        const f = following.toJSON()
        return {
          followingId: f.id,
          avatar: f.avatar,
          account: f.account,
          name: f.name,
          introduction: f.introduction
        }
      })
      return cb(null, results)
    } catch (err) {
      return cb(err)
    }
  },
  getUserFollowers: async (req, cb) => {
    try {
      const userId = req.params.id
      const user = await User.findByPk(userId,
        {
          include: [{
            model: User,
            as: 'Followers',
            attributes: ['id', 'avatar', 'account', 'name', 'introduction']
          }]
        }
      )

      const results = user.Followers.map(follower => {
        const f = follower.toJSON()
        return {
          followerId: f.id,
          avatar: f.avatar,
          account: f.account,
          name: f.name,
          introduction: f.introduction
        }
      })
      return cb(null, results)
    } catch (err) {
      return cb(err)
    }
  },
  addLike: async (req, cb) => {
    const user = req.user.dataValues
    const TweetId = req.params.id
    try {
      const [tweet, like] = await Promise.all([
        Tweet.findByPk(TweetId, { raw: true }),
        Like.findOne({
          where: {
            TweetId,
            UserId: user.id
          },
          raw: true
        })
      ])
      if (!tweet) throw new Error('Tweet does not exist')
      if (like) throw new Error('You have already liked this tweet')
      const createdLike = await Like.create({
        UserId: user.id,
        TweetId
      })
      return cb(null, { createdLike: createdLike.toJSON() })
    } catch (err) {
      console.log(err)
      return cb(err)
    }
  },
  unLike: async (req, cb) => {
    const UserId = req.user.dataValues.id
    try {
      const like = await Like.findOne({
        where: {
          UserId,
          TweetId: req.params.id
        }
      })
      if (!like) throw new Error("You haven't liked this user!")
      const unLikeRecord = await like.destroy()
      return cb(null, unLikeRecord.toJSON())
    } catch (err) {
      console.log(err)
      return cb(err)
    }
  },
  addReply: async (req, cb) => {
    try {
      const UserId = Number(req.user.dataValues.id)
      const TweetId = Number(req.params.tweet_id)
      const { comment } = req.body

      if (!comment) throw new Error('Comment text is required!')

      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) throw new Error("Tweet didn't exist!")

      const reply = await Reply.create({
        comment,
        TweetId,
        UserId
      })

      return cb(null, { reply: reply.toJSON() })
    } catch (err) {
      console.log(err)
      return cb(err)
    }
  },
  getReplies: async (req, cb) => {
    try {
      const TweetId = Number(req.params.tweet_id)

      const replies = await Reply.findAll({
        where: { TweetId },
        include: [{ model: User, attributes: ['id', 'account', 'name', 'avatar'] }],
        order: [['createdAt', 'DESC']],
        nest: true,
        raw: true
      })

      return cb(null, replies)
    } catch (err) {
      console.log(err)
      return cb(err)
    }
  }
}

module.exports = userServices

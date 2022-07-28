const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { User, Tweet, Reply, Like, Followship } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userServices = {
  signUp: (req, cb) => {
    if (req.body.password !== req.body.checkPassword) throw new Error('Passwords do not match!')

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')

        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => {
        return User.create({
          account: req.body.account,
          name: req.body.name,
          email: req.body.email,
          password: hash
        })
      })
      .then(newUser => {
        const data = newUser.toJSON()
        delete data.password
        return cb(null, { user: data })
      })
      .catch(err => cb(err))
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

      const followings = await Followship.findAll(
        { where: { followerId: req.user.dataValues.id } }
      )

      users = users.map(user => {
        return ({
          id: user.dataValues.id,
          account: user.dataValues.account,
          name: user.dataValues.name,
          isFollowed: followings.some(f => f.followingId === user.dataValues.id),
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
          const likeCount = await Like.count({ where: TweetId })
          const replyCount = await Reply.count({ where: TweetId })
          results.push({ ...like, Tweet: { ...like.Tweet, likeCount, replyCount } })
        })
      )
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
      const followings = await Followship.findAll(
        { where: { followerId: req.params.id } }
      )
      return cb(null, followings)
    } catch (err) {
      return cb(err)
    }
  },
  getUserFollowers: async (req, cb) => {
    try {
      const followers = await Followship.findAll(
        { where: { followingId: req.params.id } }
      )
      return cb(null, followers)
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

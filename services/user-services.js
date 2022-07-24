const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { User, Tweet, Reply, Like, Followship } = require('../models')

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
      const hash = await bcrypt.hash(req.body.password, 10)

      const updateData = {}
      req.body.account && (updateData.account = req.body.account)
      req.body.name === undefined || (updateData.name = req.body.name)
      req.body.email && (updateData.email = req.body.email)
      req.body.password === undefined || (updateData.password = hash)
      req.body.introduction === undefined || (updateData.introduction = req.body.introduction)

      await user.update(updateData)

      const userData = user.toJSON()
      delete userData.password
      return cb(null, userData)
    } catch (err) {
      return cb(err)
    }
  },
  getUserTweets: (req, cb) => {
    const UserId = req.params.id
    Tweet.findAll({
      where: { UserId },
      include: [User],
      nest: true,
      raw: true
    })
      .then(tweets => cb(null, tweets))
      .catch(err => cb(err))
  },
  getUserReplies: (req, cb) => {
    const UserId = req.params.id
    Reply.findAll({
      where: { UserId },
      include: [{ model: User }, { model: Tweet, include: [{ model: User }] }],
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
        include: [{ model: Tweet, include: [{ model: User }] }],
        order: [['createdAt', 'DESC']],
        nest: true,
        raw: true
      })

      const results = []
      await Promise.all(
        likedTweets.map(async tweet => {
          const TweetId = tweet.TweetId
          const likeCount = await Like.count({ where: TweetId })
          const replyCount = await Reply.count({ where: TweetId })
          results.push({ ...tweet, Tweet: { ...tweet.Tweet, likeCount, replyCount } })
        })
      )
      return cb(null, results)
    } catch (err) {
      cb(err)
    }
  },
  addFollowing: async (req, cb) => {
    try {
      const followerId = req.user.id
      const followingId = Number(req.params.followingId)
      const [user, followship] = await Promise.all([
        User.findByPk(followingId),
        Followship.findOne({
          where: {
            followerId,
            followingId
          }
        })
      ])

      if (!user) throw new Error("User didn't exist!")
      if (followship) throw new Error('You are already following this user!')

      await Followship.create({
        followerId,
        followingId
      })

      return cb(null, { followerId, followingId })
    } catch (err) {
      return cb(err)
    }
  },
  getUserFollowings: async (req, cb) => {
    try {
      const followings = await Followship.findAll(
        { where: { followerId: req.params.id } }
      )
      return cb(null, { followings })
    } catch (err) {
      return cb(err)
    }
  },
  getUserFollowers: async (req, cb) => {
    try {
      const followers = await Followship.findAll(
        { where: { followingId: req.params.id } }
      )
      return cb(null, { followers })
    } catch (err) {
      return cb(err)
    }
  }
}

module.exports = userServices

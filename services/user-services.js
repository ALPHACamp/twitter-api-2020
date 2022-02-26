const Sequelize = require('sequelize')
const Op = Sequelize.Op
const jwt = require('jsonwebtoken')
const { User, Tweet, Reply, Like, Followship } = require('../models')
const bcrypt = require('bcryptjs')
const { imgurFileHandler } = require('../helpers/file-helper')

const userController = {
  signUp: async (req, cb) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      if (password !== checkPassword) throw new Error('Passwords do not match!')
      if (name.length > 50) {
        throw new Error('String must not exceed 50 characters!')
      }
      const user = await User.findOne({
        where: {
          [Op.or]: [{ email }, { account }]
        }
      })
      if (user) throw new Error('Email or Account already exists!')
      const hash = await bcrypt.hash(req.body.password, 10)
      const newUser = await User.create({
        account,
        name,
        email,
        password: hash
      })
      const userData = {
        status: 'suceess',
        data: {
          user: {
            id: newUser.id,
            account: newUser.account,
            name: newUser.name,
            email: newUser.email
          }
        }
      }
      return cb(null, { userData })
    } catch (err) {
      return cb(err)
    }
  },
  signIn: (req, cb) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      const tokenData = {
        status: 'success',
        data: {
          token,
          user: userData
        }
      }
      return cb(null, { tokenData })
    } catch (err) {
      return cb(err)
    }
  },
  getUser: async (req, cb) => {
    try {
      const user = await User.findByPk(req.params.id, {
        raw: true,
        nest: true
      })
      const followers = await Followship.findAndCountAll({
        raw: true,
        where: { FollowingId: req.params.id }
      })
      const followings = await Followship.findAndCountAll({
        raw: true,
        where: { FollowerId: req.params.id }
      })
      const userData = {
        status: 'success',
        ...user,
        followersCount: followers.count,
        followingsCount: followings.count
      }
      delete userData.password
      return cb(null, userData)
    } catch (err) {
      cb(err)
    }
  },
  getTweets: async (req, cb) => {
    try {
      const user = await User.findByPk(req.params.id, {
        raw: true,
        nest: true,
        include: [
          { model: User, as: 'Followings' }
        ]
      })
      const tweets = await Tweet.findAll({
        where: { UserId: user.id },
        attributes: [
          'id',
          'UserId',
          'description',
          'createdAt',
          'updatedAt'
        ],
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [User]
      })
      for (const tweet of tweets) {
        const [repliesResult, likesResult] = await Promise.all([
          Reply.count({
            where: { TweetId: tweet.id }
          }),
          Like.count({
            where: { TweetId: tweet.id }
          })
        ])
        tweet.repliesCount = repliesResult
        tweet.likesCount = likesResult
        delete tweet.User.password
      }
      return cb(null, tweets)
    } catch (err) {
      return cb(err)
    }
  },
  getRepliedTweets: async (req, cb) => {
    try {
      const user = await User.findByPk(req.params.id, {
        raw: true,
        nest: true,
        include: [
          { model: User, as: 'Followings' }
        ]
      })
      const replies = await Reply.findAll({
        where: { UserId: user.id },
        attributes: ['id', 'UserId', 'TweetId', 'comment', 'createdAt', 'updatedAt'],
        raw: true
      })
      return cb(null, replies)
    } catch (err) {
      return cb(err)
    }
  },
  putUser: async (req, cb) => {
    const { account, name, email, password, checkPassword, introduction, avatar, cover } = req.body
    const where = {}
    const { files } = req

    async function uploadFiles (files) {
      const filesArr = []
      for (const file in files) {
        filesArr.push(files[file][0])
      }
      for (const file of filesArr) {
        const imgurUrl = await imgurFileHandler(file)
        where[file.fieldname] = imgurUrl
      }
    }
    try {
      if (password !== checkPassword) throw new Error('Passwords do not match!')
      if (introduction && (introduction.length > 160)) throw new Error('Introduction exceeds the word limit!')
      if (name && (name.length > 50)) throw new Error('Name exceeds the word limit!')
      const registereduser = await User.findOne({
        raw: true,
        where: {
          [Op.or]: [{ email }, { account }],
          [Op.not]: [{ id: req.params.id }]
        }
      })
      if (registereduser) throw new Error('Acount or Email repeated!')
      const user = await User.findByPk(req.params.id, {
        include: [{ model: User, as: 'Followings' }]
      })

      // pass, update user
      const reqBodyArr = { account, name, email, password, introduction, avatar, cover }
      for (const attribute in reqBodyArr) {
        if (reqBodyArr[attribute]) {
          where[attribute] = reqBodyArr[attribute]
        }
      }
      await uploadFiles(files)
      const updatedUser = await user.update(where)
      const updatedData = { ...updatedUser.dataValues }
      delete updatedData.password
      const userData = {
        status: 'success',
        data: {
          user: {
            ...updatedData
          }
        }
      }
      return cb(null, userData)
    } catch (err) {
      return cb(err)
    }
  },
  getFollowers: async (req, cb) => {
    try {
      const user = await User.findByPk(req.params.id, {
        include: [
          { model: User, as: 'Followers' }
        ]
      })
      const followers = user.Followers.map(e => e.dataValues)
      followers.forEach(e => {
        delete e.Followship
        e.followerId = e.id
      })
      return cb(null, followers)
    } catch (err) {
      return cb(err)
    }
  },
  getFollowings: async (req, cb) => {
    try {
      const user = await User.findByPk(req.params.id, {
        include: [
          { model: User, as: 'Followings' }
        ]
      })
      const followings = user.Followings.map(e => e.dataValues)
      followings.forEach(e => {
        delete e.Followship
        e.followingId = e.id
      })
      return cb(null, followings)
    } catch (err) {
      return cb(err)
    }
  },
  getLikes: async (req, cb) => {
    try {
      const user = await User.findByPk(req.params.id, {
        include: [
          { model: User, as: 'Followings' }
        ]
      })
      const likedTweets = await Like.findAll({
        raw: true,
        nest: true,
        where: { UserId: user.id },
        include: [{
          model: Tweet
        }]
      })
      likedTweets.forEach(e => {
        delete e.tweetId
        delete e.userId
        delete e.Tweet.userId
      })
      return cb(null, likedTweets)
    } catch (err) {
      return cb(err)
    }
  }
}
module.exports = userController

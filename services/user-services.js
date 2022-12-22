const { User, Like, Tweet, Followship, Reply } = require('./../models')
const sequelize = require('sequelize')
const jwt = require('jsonwebtoken')
// const { imgurFileHandler } = require('../helpers/file-helpers')
const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')

const userServices = {
  loginUser: (req, cb) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      cb(null, {
        status: 'success',
        token,
        user: userData
      })
    } catch (err) {
      cb(err)
    }
  },
  registerUser: (req, cb) => {
    const { account, name, email, password, checkPassword } = req.body
    // password check
    if (password !== checkPassword) throw new Error('Passwords do not match!')
    // account and email check
    return Promise.all([
      User.findOne({ where: { account } }), User.findOne({ where: { email } })
    ])
      .then(([userWithAccount, userWithEmail]) => {
        if (userWithAccount) throw new Error('Account already exists!')
        if (userWithEmail) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(user => {
        if (user.account === account) throw new Error('Account already exists!')
        if (user.email === email) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        account,
        name,
        email,
        password: hash,
        role: 'user',
        avatar: `https://loremflickr.com/320/240/cat?random=${Math.random() * 100}`,
        cover: `https://loremflickr.com/820/312/space?random=${Math.random() * 100}`
      }))
      .then(user => {
        delete user.password
        cb(null, user)
      })
      .catch(err => cb(err))
  },
  getUser: (req, cb) => {
    return User.findByPk(req.params.userId, {
      attributes: [
        'id', 'name', 'account', 'email', 'introduction', 'avatar', 'cover',
        [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE following_id = User.id)'), 'followerCount'],
        [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE follower_id = User.id)'), 'followingCount']
      ],
      raw: true
    })
      .then(user => {
        if (!user) throw new Error('user do not exist.')
        cb(null, user)
      })
      .catch(err => cb(err))
  },
  editUser: (req, cb) => {
    const { account, name, email, introduction, password, avatar, cover } = req.body
    const UserId = req.params.userId
    return Promise.all([
      User.findByPk(UserId)
    ])
      .then(([user, avatarFilePath, coverFilePath]) => {
        if (!user) throw new Error("User didn't exist!")
        return user.update({
          account,
          name,
          email,
          introduction,
          password,
          avatar,
          cover
        })
      })
      .then(updatedUser => {
        delete updatedUser.password
        cb(null, { user: updatedUser })
      })
      .catch(err => cb(err))
  },
  getUserFollowings: (req, cb) => {
    const UserId = req.params.userId
    return Followship.findAll({
      where: { followerId: UserId },
      include: [{ model: User, as: 'followingUser', attributes: ['name', 'avatar', 'account'] }],
      attributes: [
        'followingId', 'followerId',
        [sequelize.literal(`EXISTS (SELECT id FROM Followships WHERE follower_id = ${UserId} AND following_id = followingId )`), 'isFollowed']],
      raw: true
    })
      .then(followings => {
        cb(null, followings)
      })
      .catch(err => cb(err))
  },
  getUserFollowers: (req, cb) => {
    const UserId = req.params.userId
    return Followship.findAll({
      where: { followingId: UserId },
      include: [{ model: User, as: 'followerUser', attributes: ['name', 'avatar', 'account'] }],
      attributes: [
        'followingId', 'followerId',
        [sequelize.literal(`EXISTS (SELECT id FROM Followships WHERE following_id = followerId AND follower_id = ${UserId} )`), 'isFollowed']],
      raw: true
    })
      .then(followers =>
        cb(null, followers)
      )
      .catch(err => cb(err))
  },
  getUserTweets: (req, cb) => {
    const UserId = req.params.userId
    return Tweet.findAll({
      where: { UserId },
      attributes: {
        include: [
          [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE tweet_id = Tweet.id)'), 'replyCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE tweet_id = Tweet.id)'), 'likedCount']
        ]
      },
      include: [{
        model: User,
        attributes: ['id', 'avatar', 'name', 'account']
      }],
      order: [['id', 'DESC']],
      raw: true
    })
      .then(tweets => {
        cb(null, tweets)
      })
      .catch(err => cb(err))
  },
  getUserReplies: (req, cb) => {
    const UserId = req.params.userId
    return Reply.findAll({
      where: { UserId },
      attributes: { exclude: ['TweetId'] },
      include: {
        model: Tweet,
        attributes: ['id'],
        include: {
          model: User,
          attributes: ['account']
        }
      },
      order: [['id', 'DESC']],
      raw: true
    })
      .then(replies => {
        cb(null, replies)
      })
      .catch(err => cb(err))
  },
  getLikedTweets: (req, cb) => {
    const UserId = req.params.userId
    const userId = helpers.getUser(req).id
    return Like.findAll({
      where: { UserId },
      attributes: ['id', 'TweetId'],
      include: {
        model: Tweet,
        attributes: ['id', 'description', 'createdAt', 'updatedAt',
          [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE tweet_id = Tweet.id)'), 'replyCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE tweet_id = Tweet.id)'), 'likedCount'],
          [sequelize.literal(`EXISTS (SELECT id FROM Likes WHERE tweet_id = Tweet.id AND user_id = ${userId})`), 'isLiked']
        ],
        include: {
          model: User,
          attributes: ['id', 'avatar', 'name', 'account']
        }
      },
      order: [['id', 'DESC']],
      raw: true
    })
      .then(likedTweets => cb(null, likedTweets))
      .catch(err => cb(err))
  }
}
module.exports = userServices

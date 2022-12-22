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
      if (userData.role === 'admin') throw new Error("account doesn't exist!")
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
        user = user.toJSON()
        delete user.password
        cb(null, user)
      })
      .catch(err => cb(err))
  },
  getUser: (req, cb) => {
    return User.findByPk(req.params.userId, {
      attributes: [
        'id', 'name', 'account', 'email', 'introduction', 'avatar', 'cover',
        [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE User_id = User.id)'), 'tweetCount'],
        [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE following_id = User.id)'), 'followerCount'],
        [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE follower_id = User.id)'), 'followingCount']
      ],
      raw: true,
      nest: true
    })
      .then(user => {
        if (!user) throw new Error('user do not exist.')
        cb(null, user)
      })
      .catch(err => cb(err))
  },
  editUser: (req, cb) => {
    const { account, name, email, introduction, password, avatar, cover, checkPassword } = req.body
    const UserId = Number(req.params.userId)
    const currentUserId = helpers.getUser(req).id
    if (UserId !== currentUserId) throw new Error('You can only edit your own profile!')
    // password check
    if (password !== checkPassword) throw new Error('Passwords do not match!')
    return Promise.all([User.findByPk(UserId), User.findOne({ where: { account } }), User.findOne({ where: { email } })])
      .then(([user, foundUserByAccount, foundUserByEmail]) => {
        if (!user) throw new Error("User didn't exist!")
        // check if account and email exists in db
        // if (foundUserByAccount?.account === user.account) throw new Error('Account already exists!')
        // if (user.email !== email) throw new Error('email already exists!')
        return user.update({
          account,
          name,
          email,
          introduction,
          password: password ? bcrypt.hashSync(password, 10) : user.password,
          avatar: avatar || user.avatar,
          cover: cover || user.cover
        })
      })
      .then(user => {
        user = user.toJSON()
        delete user.password
        cb(null, user)
      })
      .catch(err => cb(err))
  },
  getUserFollowings: (req, cb) => {
    const UserId = req.params.userId
    return Followship.findAll({
      where: { followerId: UserId },
      include: [{ model: User, as: 'followingUser', attributes: ['id', 'name', 'avatar', 'account', 'introduction'] }],
      attributes: [
        'followingId', 'followerId',
        [sequelize.literal(`EXISTS (SELECT id FROM Followships WHERE follower_id = ${UserId} AND following_id = followingId )`), 'isFollowed']],
      raw: true,
      nest: true
    })
      .then(datas => {
        const followings = datas.map(data => ({
          ...data,
          isFollowed: data.isFollowed === 1
        }))
        followings.forEach(f => {
          delete f.followingId
          delete f.followerId
        })
        cb(null, followings)
      })
      .catch(err => cb(err))
  },
  getUserFollowers: (req, cb) => {
    const UserId = req.params.userId
    return Followship.findAll({
      where: { followingId: UserId },
      include: [{ model: User, as: 'followerUser', attributes: ['id', 'name', 'avatar', 'account', 'introduction'] }],
      attributes: [
        'followingId', 'followerId',
        [sequelize.literal(`EXISTS (SELECT id FROM Followships WHERE following_id = followerId AND follower_id = ${UserId} )`), 'isFollowed']],
      raw: true,
      nest: true
    })
      .then(datas => {
        const followers = datas.map(data => ({
          ...data,
          isFollowed: data.isFollowed === 1
        }))
        followers.forEach(f => {
          delete f.followingId
          delete f.followerId
        })
        cb(null, followers)
      })
      .catch(err => cb(err))
  },
  getUserTweets: (req, cb) => {
    const UserId = req.params.userId
    const userId = helpers.getUser(req).id
    return Tweet.findAll({
      where: { UserId },
      attributes: {
        include: [
          [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE tweet_id = Tweet.id)'), 'replyCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE tweet_id = Tweet.id)'), 'likedCount'],
          [sequelize.literal(`EXISTS (SELECT id FROM Likes WHERE tweet_id = Tweet.id AND user_id = ${userId})`), 'isLiked']
        ]
      },
      include: [{
        model: User,
        attributes: ['id', 'avatar', 'name', 'account']
      }],
      order: [['id', 'DESC']],
      raw: true,
      nest: true
    })
      .then(datas => {
        const tweets = datas.map(data => ({
          ...data,
          isLiked: data.isLiked === 1
        }))
        tweets.forEach(t => delete t.UserId)
        cb(null, tweets)
      })
      .catch(err => cb(err))
  },
  getUserReplies: (req, cb) => {
    const UserId = req.params.userId
    return Reply.findAll({
      where: { UserId },
      attributes: { exclude: ['TweetId'] },
      include: [
        {
          model: Tweet,
          attributes: ['id'],
          include: {
            model: User,
            attributes: ['id', 'account']
          }
        },
        {
          model: User,
          attributes: ['id', 'avatar', 'account', 'name']
        }],
      order: [['id', 'DESC']],
      raw: true,
      nest: true
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
      raw: true,
      nest: true
    })
      .then(datas => {
        const likedTweets = datas.map(t => (
          {
            ...t.Tweet,
            isLiked: t.Tweet.isLiked === 1
          }))
        cb(null, likedTweets)
      })
      .catch(err => cb(err))
  }
}
module.exports = userServices

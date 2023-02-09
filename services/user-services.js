const { User, Like, Tweet, Followship, Reply } = require('./../models')
const sequelize = require('sequelize')
const jwt = require('jsonwebtoken')
const { imgurFileHandler } = require('../helpers/file-helpers')
const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')

const userServices = {
  loginUser: (req, cb) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      if (userData.role === 'admin') throw new Error('帳號不存在!')
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      cb(null, {
        success: true,
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
    if (password !== checkPassword) throw new Error('密碼不相符!')
    // account and email check
    return Promise.all([
      User.findOne({ where: { account } }), User.findOne({ where: { email } })
    ])
      .then(([userWithAccount, userWithEmail]) => {
        if (userWithAccount) throw new Error('帳號已被使用!')
        if (userWithEmail) throw new Error('信箱已被使用!')
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
  getCurrentUser: (req, cb) => {
    const currentUserId = helpers.getUser(req).id
    return User.findByPk(currentUserId, {
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
        if (!user) throw new Error('使用者不存在!')
        cb(null, user)
      })
      .catch(err => cb(err))
  },
  getUser: (req, cb) => {
    const UserId = helpers.getUser(req).id
    return User.findByPk(req.params.userId, {
      attributes: [
        'id', 'name', 'account', 'email', 'introduction', 'avatar', 'cover',
        [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE User_id = User.id)'), 'tweetCount'],
        [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE following_id = User.id)'), 'followerCount'],
        [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE follower_id = User.id)'), 'followingCount'],
        [sequelize.literal(`EXISTS (SELECT id FROM Followships WHERE follower_id = ${UserId} AND following_id = User.id )`), 'isFollowed']
      ],
      raw: true,
      nest: true
    })
      .then(user => {
        if (!user) throw new Error('使用者不存在!')
        user.isFollowed = user.isFollowed === 1
        cb(null, user)
      })
      .catch(err => cb(err))
  },
  editUser: (req, cb) => {
    const { account, name, email, introduction, password, checkPassword, cover } = req.body
    const { files } = req
    const avatarData = files?.avatar ? files.avatar[0] : null
    const coverData = files?.cover ? files.cover[0] : null
    // const avatarString = avatar
    const coverString = cover
    const UserId = Number(req.params.userId)
    const { id, role } = helpers.getUser(req)
    if (role !== 'admin' && UserId !== id) throw new Error('不可更改其他使用者資料!') // add role !== 'admin' for development purposes
    // password check
    if (password !== checkPassword) throw new Error('密碼不相符!')
    // check if account and email exists in db
    return Promise.all([
      User.findByPk(UserId),
      User.findOne({ where: { account: account || null } }),
      User.findOne({ where: { email: email || null } }),
      imgurFileHandler(avatarData),
      imgurFileHandler(coverData)
    ])
      .then(([
        user,
        foundUserByAccount,
        foundUserByEmail, avatar, cover]) => {
        if (!user) throw new Error('帳號不存在!')
        if (foundUserByAccount?.account && user.account !== account) throw new Error('帳號已被使用!')
        if (foundUserByEmail?.email && user.email !== email) throw new Error('信箱已被使用!')
        return user.update({
          account: account || user.account,
          name: name || user.name,
          email: email || user.email,
          introduction: introduction || user.introduction,
          password: password ? bcrypt.hashSync(password, 10) : user.password,
          avatar: avatar || user.avatar,
          cover: cover || ((coverString === 'delete') ? null : user.cover)
        })
      })
      .then(user => {
        user = user.toJSON()
        delete user.password
        cb(null, user)
      })
      .catch(err => cb(err))
  },
  getUserFollowings: (req, cb) => { // Keep followingId for test
    const UserId = req.params.userId
    return Followship.findAll({
      where: { followerId: UserId },
      include: [{ model: User, as: 'followingUser', attributes: ['id', 'name', 'avatar', 'account', 'introduction'] }],
      attributes: [
        'followingId', 'followerId',
        [sequelize.literal(`EXISTS (SELECT id FROM Followships WHERE follower_id = ${UserId} AND following_id = followingId )`), 'isFollowed']],
      order: [['id', 'DESC']],
      raw: true,
      nest: true
    })
      .then(datas => {
        const followings = datas.map(data => ({
          ...data,
          isFollowed: data.isFollowed === 1
        }))
        cb(null, followings)
      })
      .catch(err => cb(err))
  },
  getUserFollowers: (req, cb) => { // Keep followerId for test
    const UserId = req.params.userId
    return Followship.findAll({
      where: { followingId: UserId },
      include: [{ model: User, as: 'followerUser', attributes: ['id', 'name', 'avatar', 'account', 'introduction'] }],
      attributes: [
        'followingId', 'followerId',
        [sequelize.literal(`EXISTS (SELECT id FROM Followships WHERE following_id = followerId AND follower_id = ${UserId} )`), 'isFollowed']],
      order: [['id', 'DESC']],
      raw: true,
      nest: true
    })
      .then(datas => {
        const followers = datas.map(data => ({
          ...data,
          isFollowed: data.isFollowed === 1
        }))
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
        attributes: ['description', 'createdAt', 'updatedAt',
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
            TweetId: t.TweetId,
            isLiked: t.Tweet.isLiked === 1
          }))
        cb(null, likedTweets)
      })
      .catch(err => cb(err))
  }
}
module.exports = userServices

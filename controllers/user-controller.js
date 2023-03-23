const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { imgurFileHandler } = require('../helpers/file-helpers')

const { User, Tweet, Reply, Like, Followship, Sequelize } = require('../models')

const helpers = require('../_helpers')

const userController = {
  // 登入
  signIn: async (req, res, next) => {
    const { account, password } = req.body ?? {}
    if (!account || !password) {
      return res.status(400).json({ status: 'error', message: 'Account and password are required' })
    }
    try {
      const user = await User.findOne({ where: { account } })
      if (!user) return res.status(404).json({ status: 'error', message: 'User does not exist' })
      if (user.role === 'admin') return res.status(404).json({ status: 'error', message: 'User does not exist' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: 'Incorrect password' })
      }
      const userData = user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET)
      return res.status(200).json({
        status: 'success',
        message: 'Successfully sign in',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  // 註冊
  signUp: async (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body ?? {}
    if (!account || !name || !email || !password) {
      return res.status(400).json({ status: 'error', message: 'All fields are required' })
    }
    if (password.length < 5 || password.length > 12) {
      return res.status(400).json({ status: 'error', message: 'Password should be between 5-12' })
    }
    if (password !== checkPassword) {
      return res.status(400).json({ status: 'error', message: 'Check password do not match' })
    }
    if (name.length < 1 || name.length > 50) {
      return res.status(400).json({ status: 'error', message: 'Name should be less than 50' })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ status: 'error', message: 'Invalid email address' })
    }
    try {
      const [userAccount, userEmail] = await Promise.all([
        User.findOne({ where: { account } }),
        User.findOne({ where: { email } })
      ])
      if (userAccount || userEmail) {
        return res.status(400).json({ status: 'error', message: 'Existing email or user account' })
      }
      const hash = await bcrypt.hash(password, 10)
      const newUser = await User.create({
        account,
        name,
        email,
        password: hash
      })
      const userData = newUser.toJSON()
      delete userData.password
      return res.status(200).json({
        status: 'success',
        message: 'Successfully sign up',
        data: { user: userData }
      })
    } catch (err) {
      next(err)
    }
  },
  getUser: async (req, res, next) => {
    const id = req.params?.id
    try {
      const user = await User.findByPk(id, {
        attributes: [
          'id',
          'name',
          'account',
          'avatar',
          'cover',
          'introduction',
          'role',
          [Sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id )'), 'tweet_count'],
          [Sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.FollowerId = User.id )'), 'following_count'],
          [Sequelize.literal('(SELECT COUNT(*) FROM Followships  WHERE Followships.FollowingId = User.id )'), 'follower_count'],
          [Sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.UserId = User.id )'), 'total_like']
        ]
      })
      if (!user || user.role === 'admin') return res.status(404).json({ status: 'error', message: 'User not found' })
      const userData = user.toJSON()
      delete userData.role
      return res.status(200).json(userData)
    } catch (err) { next(err) }
  },
  getUserTweets: async (req, res, next) => {
    const ownerId = helpers.getUser(req)?.id
    const id = req.params?.id
    try {
      const user = await User.findByPk(id)
      if (!user) { return res.status(404).json({ status: 'error', message: 'User not found' }) }
      const tweets = await Tweet.findAll({
        where: { UserId: id },
        attributes: [
          'id',
          'description',
          'createdAt',
          'updatedAt',
          [Sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id )'), 'reply_count'],
          [Sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id )'), 'like_count'],
          [Sequelize.literal(`(SELECT COUNT(*) FROM Likes WHERE Likes.UserId = ${ownerId} AND Likes.TweetId = Tweet.id )`), 'is_liked']
        ],
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'account', 'avatar']
          },
          {
            model: Reply,
            attributes: { exclude: ['UserId', 'TweetId'] },
            include: [
              {
                model: User,
                attributes: ['id', 'name', 'account', 'avatar']
              }
            ],
            order: [['updatedAt', 'DESC']]
          }
        ],
        order: [['updatedAt', 'DESC']],
        nest: true
        // 使用 raw: true 會造成回覆資料只有一筆，故移除
      })
      if (!tweets) return res.status(404).json({ status: 'error', message: 'Tweets not found' })
      return res.status(200).json(tweets)
    } catch (err) { next(err) }
  },
  getUserReplies: async (req, res, next) => {
    const id = req.params?.id
    try {
      const user = await User.findByPk(id)
      if (!user) { return res.status(404).json({ status: 'error', message: 'User not found' }) }
      const replies = await Reply.findAll({
        where: { UserId: id },
        attributes: ['id', 'comment', 'createdAt', 'updatedAt'],
        include: [{
          model: Tweet,
          attributes: ['id', 'description', 'createdAt', 'updatedAt'],
          include: [{
            model: User,
            attributes: ['id', 'name', 'account', 'avatar']
          }]
        }, {
          model: User,
          attributes: ['id', 'name', 'account', 'avatar']
        }],
        order: [['updatedAt', 'DESC']],
        nest: true,
        naw: true
      })
      if (!replies) return res.status(404).json({ status: 'error', message: 'Replies not found' })
      return res.status(200).json(replies)
    } catch (err) { next(err) }
  },
  getUserLikes: async (req, res, next) => {
    const ownerId = helpers.getUser(req)?.id
    const id = req.params?.id
    try {
      const user = await User.findByPk(id)
      if (!user) { return res.status(404).json({ status: 'error', message: 'User not found' }) }
      const likes = await Like.findAll({
        where: { UserId: id },
        include: [{
          model: Tweet,
          attributes: [
            'id',
            'description',
            'createdAt',
            'updatedAt',
            [Sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id )'), 'reply_count'],
            [Sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id )'), 'like_count'],
            [Sequelize.literal(`(SELECT COUNT(*) FROM Likes WHERE Likes.UserId = ${ownerId} AND Likes.TweetId = Tweet.id )`), 'is_liked']
          ],
          include: [{
            model: User,
            attributes: ['id', 'name', 'account', 'avatar']
          }]
        }],
        order: [['updatedAt', 'DESC']],
        nest: true,
        raw: true
      })
      return res.status(200).json(likes)
    } catch (err) { next(err) }
  },
  getUserFollowing: async (req, res, next) => {
    const ownerId = helpers.getUser(req)?.id
    const id = req.params?.id
    try {
      const user = await User.findByPk(id)
      if (!user) { return res.status(404).json({ status: 'error', message: 'User not found' }) }
      const userFollowings = await Followship.findAll({
        where: { followerId: id },
        include: [{
          model: User,
          as: 'Followings',
          attributes: [
            'account',
            'name',
            'avatar',
            'cover',
            [Sequelize.literal(`(SELECT COUNT(*) FROM Followships WHERE Followships.followerId = ${ownerId} AND Followships.followingId = Followings.id )`),
              'is_followed']
          ]
        }],
        order: [['createdAt', 'DESC']],
        nest: true,
        raw: true
      })
      return res.status(200).json(userFollowings)
    } catch (err) { next(err) }
  },
  getUserFollower: async (req, res, next) => {
    const ownerId = helpers.getUser(req)?.id
    const id = req.params?.id
    try {
      const user = await User.findByPk(id)
      if (!user) { return res.status(404).json({ status: 'error', message: 'User not found' }) }
      const userFollowers = await Followship.findAll({
        where: { followingId: id },
        include: [{
          model: User,
          as: 'Followers',
          attributes: [
            'account',
            'name',
            'avatar',
            'cover',
            [Sequelize.literal(`(SELECT COUNT(*) FROM Followships WHERE Followships.followerId = ${ownerId} AND Followships.followingId = Followers.id )`),
              'is_followed']
          ]
        }],
        order: [['createdAt', 'DESC']],
        nest: true,
        raw: true
      })
      return res.status(200).json(userFollowers)
    } catch (err) { next(err) }
  },
  putUser: async (req, res, next) => {
    const id = req.params?.id
    const { name, introduction } = req.body ?? {}
    const { avatar = null, cover = null } = req.files || {}
    if (name.length < 1 || name.length > 50) {
      return res.status(400).json({ status: 'error', message: 'Name should be less than 50' })
    }
    if (introduction.length > 160) return res.status(400).json({ status: 'error', message: 'introduction should be less than 160 characters' })
    try {
      const user = await User.findByPk(id)
      if (!user) return res.status(404).json({ status: 'error', message: 'User not found' })
      const filePaths = {
        updatedAvatar: avatar ? await imgurFileHandler(avatar[0]) : null,
        updatedCover: cover ? await imgurFileHandler(cover[0]) : null
      }
      const updatedUser = await user.update({
        name,
        avatar: filePaths.updatedAvatar || user.avatar,
        cover: filePaths.updatedCover || user.cover,
        introduction
      })
      return res.status(200).json({
        status: 'success',
        message: 'Successfully updated the user',
        data: { user: updatedUser }
      })
    } catch (err) { next(err) }
  },
  addFollowing: async (req, res, next) => {
    const ownerId = helpers.getUser(req)?.id
    const userId = req.body?.id
    if (ownerId === userId) return res.status(400).json({ status: 'error', message: 'You can not follow yourself' })
    try {
      const [user, followship] = await Promise.all([
        User.findByPk(userId),
        Followship.findOne({
          where: {
            followerId: ownerId,
            followingId: userId
          }
        })
      ])
      if (!user) return res.status(404).json({ status: 'error', message: 'User not found' })
      if (followship) return res.status(400).json({ status: 'error', message: 'You are already following this user!' })
      await Followship.create({
        followerId: ownerId,
        followingId: userId
      })
      return res.json({
        status: 'success',
        message: 'Successfully followed the user',
        data: { user }
      })
    } catch (err) {
      next(err)
    }
  },
  removeFollowing: async (req, res, next) => {
    const ownerId = helpers.getUser(req).id
    const userId = req.params?.followingId
    if (ownerId === userId) return res.status(400).json({ status: 'error', message: 'You can not follow yourself and certainly can not undo' })
    try {
      const [user, followship] = await Promise.all([
        User.findByPk(userId),
        Followship.findOne({
          where: {
            followerId: ownerId,
            followingId: userId
          }
        })
      ])
      if (!user) return res.status(404).json({ status: 'error', message: 'User not found' })
      if (!followship) return res.status(400).json({ status: 'error', message: 'You are not followed this user!' })
      await followship.destroy()
      return res.json({
        status: 'success',
        message: 'Successfully unfollowed the user',
        data: { user }
      })
    } catch (err) {
      next(err)
    }
  },
  getUserSetting: async (req, res, next) => {
    try {
      // 刪除多餘資訊
      const user = helpers.getUser(req).toJSON()
      delete user.avatar
      delete user.cover
      delete user.introduction
      delete user.role
      return res.status(200).json({
        status: 'success',
        message: 'Successfully get the user',
        data: { user }
      })
    } catch (err) {
      next(err)
    }
  },
  putUserSetting: async (req, res, next) => {
    const { account, name, email, password } = req.body ?? {}
    const originalUserData = helpers.getUser(req)?.toJSON()
    try {
      // 重複帳號
      let duplicateAccount = null
      // 重複信箱
      let duplicateEmail = null
      // 有更新帳號
      if (originalUserData.account !== account) {
        duplicateAccount = await User.findOne({ where: { account } })
      }
      // 有更新信箱
      if (originalUserData.email !== email) {
        duplicateEmail = await User.findOne({ where: { email } })
      }
      // 更新後的帳號或信箱已存在
      if (duplicateAccount || duplicateEmail) {
        return res.status(400).json({ status: 'error', message: 'Existing email or user account' })
      }
      const user = await User.findByPk(originalUserData.id)
      const hash = await bcrypt.hash(password, 10)
      const updatedUser = await user.update({
        account,
        name,
        email,
        password: hash
      })
      // 刪除多餘資訊
      const newUser = updatedUser.toJSON()
      delete newUser.avatar
      delete newUser.cover
      delete newUser.introduction
      delete newUser.role
      return res.status(200).json({
        status: 'success',
        message: 'Successfully updated the user',
        data: { user: newUser }
      })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = userController

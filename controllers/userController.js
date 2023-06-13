const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sequelize = require('sequelize')
const { User, Tweet, Followship, Like, Reply } = require('../models')
const { Op } = require('sequelize')
const { getUser } = require('../_helpers')
const { imgurFileHandler } = require('../file-helper')
const userController = {
  signUp: async (req, res, next) => {
    try {
      // 反查accout 與email 是否有被註冊過
      const user = await User.findOne({
        where: {
          [Op.or]: [{ account: req.body.account }, { email: req.body.email }]
        },
        raw: true,
        nest: true
      })
      if (user?.account === req.body.account) return res.status(400).json({ status: 'error', message: 'account已重複註冊!' })
      if (user?.email === req.body.email) return res.status(400).json({ status: 'error', message: 'email已重複註冊!' })

      const hash = await bcrypt.hash(req.body.password, 10)
      await User.create({
        name: req.body.name,
        account: req.body.account,
        email: req.body.email,
        password: hash,
        role: 'user',
        avatar: 'https://i.imgur.com/q6bwDGO.png',
        cover: 'https://i.imgur.com/1jDf2Me.png'
      })

      return res.status(200).json({
        status: 'success',
        message: '註冊成功'
      })
    } catch (err) {
      next(err)
    }
  },
  signIn: async (req, res, next) => {
    try {
      // get user data
      const userData = getUser(req)?.toJSON()
      const tokenData = Object.assign({}, { id: userData.id })

      delete userData.password
      // sign token
      const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
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
      const id = req.params.id
      const currentUserId = getUser(req).dataValues.id
      const [user, tweetCount, followerCount, followingCount] = await Promise.all([
        User.findByPk(id, { raw: true, nest: true }),
        Tweet.count({ where: { UserId: id } }),
        Followship.count({ where: { followingId: id } }),
        Followship.count({ where: { followerId: id } })
      ])
      if (!user) return res.status(404).json({ status: 'error', message: '使用者不存在' })
      delete user.password
      user.tweetCount = tweetCount
      user.followerCount = followerCount
      user.followingCount = followingCount

      // 查看其他使用者是否有追蹤自己
      if (Number(id) !== currentUserId) {
        const currentUserFollowing = await Followship.findAll({
          where: { followerId: id },
          raw: true
        })
        user.followed = currentUserFollowing.some(f => f.followingId === currentUserId)
      }

      res.status(200).json(user)
    } catch (err) { next(err) }
  },
  getUserTweet: async (req, res, next) => {
    try {
      const id = req.params.id
      const currentUserId = getUser(req).dataValues.id
      const [user, tweets] = await Promise.all([
        User.findByPk(id, { raw: true }),
        Tweet.findAll({
          where: { UserId: id },
          order: [['createdAt', 'DESC']],
          attributes: {
            include: [
              [sequelize.literal('(SELECT COUNT(id) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likeCount'],
              [sequelize.literal('(SELECT COUNT(id) FROM Replies WHERE Replies.TweetId = Tweet.id)'),
                'replyCount'],
              [sequelize.literal(`EXISTS (SELECT 1 FROM Likes WHERE UserId = ${currentUserId} AND TweetId = Tweet.id)`), 'isLiked']
            ]
          },
          raw: true,
          nest: true
        })
      ])
      if (!user) return res.status(404).json({ status: 'error', message: '使用者不存在' })
      if (!tweets.length) return res.status(200).json({ status: 'success', message: '無推文資料' })

      const data = tweets.map(tweet => ({
        TweetId: tweet.id,
        tweetOwnerId: user.id,
        tweetOwnerAccount: user.accout,
        tweetOwnerName: user.name,
        tweetOwnerAvatar: user.avatar,
        description: tweet.description,
        createdAt: tweet.createdAt,
        replyCount: tweet.replyCount,
        likeCount: tweet.likeCount,
        isLiked: Boolean(tweet.isLiked)
      }))
      res.status(200).json(data)
    } catch (err) { next(err) }
  },
  getUserReply: async (req, res, next) => {
    try {
      const id = req.params.id
      const [user, replies] = await Promise.all([
        User.findByPk(id, { raw: true, nest: true }),
        Reply.findAll({
          where: { UserId: id },
          include: [
            { model: Tweet, attributes: [] }
          ],
          attributes: {
            include: [
              [sequelize.literal('(SELECT id FROM Users WHERE Users.id = Tweet.UserId)'), 'tweetOwnerId'],
              [sequelize.literal('(SELECT account FROM Users WHERE Users.id = Tweet.UserId)'), 'tweetOwnerAccount'],
              [sequelize.literal('(SELECT name FROM Users WHERE Users.id = Tweet.UserId)'), 'tweetOwnerName']
            ]
          },
          order: [['createdAt', 'DESC']],
          raw: true,
          nest: true
        })
      ])
      if (!user) return res.status(404).json({ status: 'error', message: '使用者不存在' })
      if (!replies.length) return res.status(200).json({ status: 'success', message: '無回覆資料' })

      const data = replies.map(r => ({
        reaplyId: r.id,
        comment: r.comment,
        replyerId: user.id,
        replyerAccount: user.account,
        replyerName: user.name,
        replyerAvatar: user.avatar,
        TweetId: r.TweetId,
        tweetOwnerId: r.tweetOwnerId,
        tweetOwnerAccount: r.tweetOwnerAccount,
        tweetOwnerName: r.tweetOwnerName,
        createdAt: r.createdAt
      }))
      res.status(200).json(data)
    } catch (err) { next(err) }
  },
  getUserLike: async (req, res, next) => {
    try {
      const id = req.params.id
      const likes = await Like.findAll({
        where: { UserId: id },
        include: {
          model: Tweet,
          include: [
            { model: Like },
            { model: Reply, attributes: ['id'] },
            { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
          ],
          attributes: ['id', 'description', 'createdAt']
        },
        order: [['createdAt', 'DESC']]
      })

      if (!likes.length) return res.status(200).json({ status: 'success', message: '無Like資料' })

      const data = likes.map(l => ({
        TweetId: l.TweetId,
        description: l.Tweet.description,
        tweetOwnerId: l.Tweet.User.id,
        tweetOwnerAccount: l.Tweet.User.account,
        tweetOwnerName: l.Tweet.User.name,
        tweetOwnerAvatar: l.Tweet.User.avatar,
        createdAt: l.Tweet.createdAt,
        replyCount: l.Tweet.Replies.length,
        likeCount: l.Tweet.Likes.length,
        isLiked: l.isLiked

      }))
      res.status(200).json(data)
    } catch (err) { next(err) }
  },
  getUserfollowing: async (req, res, next) => {
    try {
      const id = req.params.id
      const currentUserId = getUser(req).dataValues.id
      const [user, following] = await Promise.all([
        User.findByPk(id, {
          include: {
            model: User,
            as: 'Followings'
          }
        }),
        // 目前登入者的追蹤資料
        Followship.findAll({
          where: { followerId: currentUserId },
          raw: true
        })
      ])

      if (!user.Followings.length) return res.status(200).json({ status: 'success', message: '無追蹤其他使用者' })

      const currentUserFollowing = following.map(f => f.followingId)
      const data = user.Followings.map(f => ({
        followingId: f.id,
        UserId: f.id,
        account: f.account,
        name: f.name,
        avatar: f.avatar,
        introduction: f.introduction,
        isFollowed: currentUserFollowing.includes(f.id)
      }))
      res.status(200).json(data)
    } catch (err) { next(err) }
  },
  getUserFollower: async (req, res, next) => {
    try {
      const id = req.params.id
      const currentUserId = getUser(req).dataValues.id
      const [user, following] = await Promise.all([
        User.findByPk(id, {
          include: { model: User, as: 'Followers' }
        }),
        Followship.findAll({
          where: { followerId: currentUserId },
          raw: true
        })
      ])

      if (!user.Followers.length) return res.status(200).json({ status: 'success', message: '無跟隨者資料' })

      const currentUserFollowing = following.map(f => f.followingId)
      const data = user.Followers.map(f => ({
        followerId: f.id,
        UserId: f.id,
        account: f.account,
        name: f.name,
        avatar: f.avatar,
        introduction: f.introduction,
        isFollowed: currentUserFollowing.includes(f.id)
      })).sort((a, b) => b.isFollowed - a.isFollowed)
      res.status(200).json(data)
    } catch (err) { next(err) }
  },
  putUserProfile: async (req, res, next) => {
    const { name, introduction } = req.body
    const avatar = req.files?.avatar?.[0] || null
    const cover = req.files?.cover?.[0] || null
    const [user, avatarFilePath, coverFilePath] = await Promise.all([User.findByPk(req.params.id),
      imgurFileHandler(avatar),
      imgurFileHandler(cover)
    ])

    if (!user) return res.status(404).json({ status: 'error', message: '使用者不存在' })
    const data = await user.update({
      name,
      introduction,
      avatar: avatarFilePath || user.avatar,
      cover: coverFilePath || user.cover
    })
    delete data.dataValues.password
    return res.status(200).json(data)
  },
  updateUserAccount: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id)
      if (!user) return res.status(404).json({ status: 'error', message: '使用者不存在' })
      // 反查accout 與email 是否有被註冊過
      const foundUser = await User.findOne({
        where: {
          id: { [Op.ne]: [req.params.id] },
          [Op.or]: [{ account: req.body.account }, { email: req.body.email }]
        },
        raw: true,
        nest: true
      })

      if (foundUser?.account === req.body.account) return res.status(400).json({ status: 'error', message: 'account已重複註冊!' })
      if (foundUser?.email === req.body.email) return res.status(400).json({ status: 'error', message: 'email已重複註冊!' })

      const hash = await bcrypt.hash(req.body.password, 10)

      await user.update({
        name: req.body.name,
        account: req.body.account,
        email: req.body.email,
        password: hash
      })
      await user.save()
      return res.status(200).json({
        status: 'success',
        message: '更新成功'
      })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = userController

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User, Tweet, Followship, Like, Reply } = require('../models')
const { Op } = require('sequelize')
const { getUser } = require('../_helpers')
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
      if (user?.account === req.body.account) throw new Error('account已重複註冊!')
      if (user?.email === req.body.email) throw new Error('email已重複註冊!')

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
      delete userData.password
      // sign token
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
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
      const [user, tweets, likes] = await Promise.all([
        User.findByPk(id, { raw: true }),
        Tweet.findAll({
          where: { UserId: id },
          include: [
            { model: Reply },
            { model: Like }
          ],
          order: [['createdAt', 'DESC']],
          attributes: ['id', 'description', 'createdAt']
        }),
        Like.findAll({ where: { UserId: currentUserId }, raw: true })
      ])
      if (!user) return res.status(404).json({ status: 'error', message: '使用者不存在' })
      if (!tweets.length) return res.status(404).json({ status: 'error', message: '無推文資料' })

      // 目前登入者的Likes
      const currentUserLikes = likes.map(l => l.TweetId)
      const data = tweets.map(tweet => ({
        tweetId: tweet.dataValues.id,
        tweetOwnerId: user.id,
        tweetOwnerAccount: user.accout,
        tweetOwnerName: user.name,
        tweetOwnerAvatar: user.avatar,
        description: tweet.dataValues.description,
        createdAt: tweet.dataValues.createdAt,
        replyCount: tweet.dataValues.Replies.length,
        likeCount: tweet.dataValues.Likes.length,
        isLiked: currentUserLikes.includes(tweet.dataValues.id)
      }))
      res.status(200).json(data)
    } catch (err) { next(err) }
  }
}
module.exports = userController

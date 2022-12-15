const bcrypt = require('bcryptjs')
const dayjs = require('dayjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const helpers = require('../_helpers')
const { User, Reply, Tweet, Like, Followship, sequelize } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helper')

const userController = {
  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      if (!account.trim() || !name.trim() || !email.trim() || !password.trim() || !checkPassword.trim()) {
        return res.status(400).json({ status: 'error', message: 'All field are required!' })
      }
      if (!validator.isEmail(email)) {
        return res.status(422).json({ status: 'error', message: 'Email input is invalid!' })
      }
      if (password !== checkPassword) {
        return res.status(422).json({ status: 'error', message: 'Password and confirmPassword do not match.' })
      }
      if (name.length > 50) {
        return res.status(422).json({ status: 'error', message: 'Name field has max length of 50 characters.' })
      }
      const [userAccount, userEmail] = await Promise.all([User.findOne({ where: { account } }), User.findOne({ where: { email } })])
      if (userAccount) return res.status(422).json({ status: 'error', message: 'Account already exists!' })
      if (userEmail) return res.status(422).json({ status: 'error', message: 'Email already exists!' })

      const hash = await bcrypt.hash(password, 10)
      await User.create({ account, name, email, password: hash })

      return res.status(200).json({ status: 'success' })
    } catch (err) { next(err) }
  },
  signIn: (req, res, next) => {
    try {
      const loginUser = helpers.getUser(req).toJSON()
      if (loginUser?.role === 'admin') return res.status(403).json({ status: 'error', message: 'Permission denied.' })
      delete loginUser.password
      loginUser.createdAt = dayjs(loginUser.createdAt).valueOf()
      loginUser.updatedAt = dayjs(loginUser.updatedAt).valueOf()
      const token = jwt.sign(loginUser, process.env.JWT_SECRET, { expiresIn: '5d' })
      res.status(200).json({ status: 'success', data: { token, user: loginUser } })
    } catch (err) { next(err) }
  },
  getUserProfile: async (req, res, next) => {
    try {
      const reqId = Number(req.params.id)
      const loginUser = helpers.getUser(req)
      const user = await User.findByPk(reqId, {
        attributes: ['id', 'account', 'name', 'email', 'avatar', 'cover', 'introduction',
          [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id)'), 'replyCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followerId = User.id)'), 'followingCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)'), 'followerCount']
        ],
        nest: true,
        raw: true
      })

      if (!user) return res.status(404).json({ status: 'error', message: 'User not found!' })
      user.isFollowed = loginUser?.Followings?.some(followingUser => followingUser?.id === Number(reqId))
      return res.status(200).json(user)
    } catch (err) { next(err) }
  },
  getUserReplies: async (req, res, next) => {
    const reqId = Number(req.params.id)
    const reqUser = await User.findByPk(reqId)
    if (!reqUser) return res.status(404).json({ status: 'error', message: 'User not found!' })
    const replies = await Reply.findAll({
      attributes: ['id', 'comment', 'createdAt'],
      include: [
        { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
        { model: Tweet, attributes: ['id'], include: { model: User, attributes: ['id', 'account'] } }
      ],
      where: { UserId: reqId },
      order: [['createdAt', 'DESC']],
      nest: true,
      raw: true
    })
    const data = replies.map(reply => ({ ...reply, createdAt: dayjs(reply.createdAt).valueOf() }))
    return res.status(200).json(data)
  },
  getUserTweets: async (req, res, next) => {
    try {
      const reqId = Number(req.params.id)
      const loginUser = helpers.getUser(req)
      const reqUser = await User.findByPk(reqId)
      if (!reqUser) return res.status(404).json({ status: 'error', message: 'User not found!' })
      const tweets = await Tweet.findAll({
        attributes: ['id', 'description', 'createdAt',
          [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'replyCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likeCount']
        ],
        include: { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
        where: { UserId: reqId },
        order: [['createdAt', 'DESC']],
        nest: true,
        raw: true
      })
      const data = tweets.map(tweet => ({
        ...tweet,
        isLiked: loginUser?.Likes?.some(loginUserLike => loginUserLike.TweetId === tweet.id),
        createdAt: dayjs(tweet.createdAt).valueOf()
      }))
      return res.status(200).json(data)
    } catch (err) { next(err) }
  },
  getUserLikes: async (req, res, next) => {
    try {
      const reqId = Number(req.params.id)
      const loginUser = helpers.getUser(req)
      const reqUser = await User.findByPk(reqId)
      if (!reqUser) return res.status(404).json({ status: 'error', message: 'User not found!' })
      const likes = await Like.findAll(
        {
          attributes: ['id', 'TweetId', 'createdAt'],
          include: [
            {
              model: Tweet,
              attributes: ['id', 'description', 'createdAt',
                [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'replyCount'],
                [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likeCount']
              ],
              include: { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
            }
          ],
          where: { UserId: reqId },
          order: [['createdAt', 'DESC']],
          nest: true,
          raw: true
        }
      )
      const data = likes.map(like => {
        like.createdAt = dayjs(like.createdAt).valueOf()
        like.Tweet.createdAt = dayjs(like.Tweet.createdAt).valueOf()
        like.Tweet.isLiked = loginUser?.Likes?.some(loginUserLike => loginUserLike.TweetId === like.Tweet.id)
        return like
      })
      return res.status(200).json(data)
    } catch (err) { next(err) }
  },
  getUserFollowers: async (req, res, next) => {
    try {
      const reqId = Number(req.params.id)
      const loginUser = helpers.getUser(req)
      const reqUser = await User.findByPk(reqId)
      if (!reqUser) return res.status(404).json({ status: 'error', message: 'User not found!' })

      const followers = await Followship.findAll({
        include: [{ model: User, as: 'Followers', attributes: ['id', 'account', 'name', 'avatar', 'introduction'] }],
        where: { followingId: reqId },
        order: [['createdAt', 'DESC']],
        nest: true,
        raw: true
      })

      const data = followers.map(follower => {
        follower.createdAt = dayjs(follower.createdAt).valueOf()
        follower.updatedAt = dayjs(follower.updatedAt).valueOf()
        follower.Followers.isFollowed = loginUser?.Followings?.some(followingUser => followingUser?.id === follower.followerId)
        return follower
      })

      return res.status(200).json(data)
    } catch (err) { next(err) }
  },
  getUserFollowings: async (req, res, next) => {
    try {
      const reqId = Number(req.params.id)
      const loginUser = helpers.getUser(req)
      const reqUser = await User.findByPk(reqId)
      if (!reqUser) return res.status(404).json({ status: 'error', message: 'User not found!' })

      const followings = await Followship.findAll({
        include: { model: User, as: 'Followings', attributes: ['id', 'account', 'name', 'avatar', 'introduction'] },
        where: { followerId: reqId },
        order: [['createdAt', 'DESC']],
        nest: true,
        raw: true
      })
      const data = followings.map(following => {
        following.createdAt = dayjs(following.createdAt).valueOf()
        following.updatedAt = dayjs(following.updatedAt).valueOf()
        following.Followings.isFollowed = loginUser?.Followings?.some(followingUser => followingUser.id === following.followingId)
        return following
      })
      return res.status(200).json(data)
    } catch (err) { next(err) }
  },
  putUserProfile: async (req, res, next) => {
    try {
      const profileId = Number(req.params.id)
      const loginUserId = helpers.getUser(req).id
      const { name, introduction } = req.body
      const { files } = req

      if (!name.trim()) {
        return res.status(400).json({ status: 'error', message: 'User name is required!' })
      }
      if (name?.length > 50) {
        return res.status(422).json({ status: 'error', message: 'Username should be less than 50 chars.' })
      }
      if (introduction?.length > 160) {
        return res.status(422).json({ status: 'error', message: "User's introduction should be less than 160 chars" })
      }
      if (profileId !== loginUserId) {
        return res.status(403).json({ status: 'error', message: "Cannot edit other user's profile." })
      }

      const [user, avatarPath, coverPath] = await Promise.all([
        User.findByPk(profileId),
        imgurFileHandler(files?.avatar ? files.avatar[0] : null),
        imgurFileHandler(files?.cover ? files.cover[0] : null)
      ])

      if (!user) return res.status(404).json({ status: 'error', message: 'Cannot find this user.' })

      await user.update({
        name,
        introduction,
        avatar: avatarPath || user.avatar,
        cover: coverPath || user.cover
      })

      return res.status(200).json({ status: 'success' })
    } catch (err) { next(err) }
  },
  getUsersTop: async (req, res, next) => {
    try {
      const loginUser = helpers.getUser(req)
      const topUsers = await User.findAll({
        attributes: ['id', 'name', 'account', 'avatar',
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)'), 'followerCount']],
        order: [[sequelize.literal('followerCount'), 'DESC']],
        limit: 10,
        raw: true,
        nest: true
      })
      const data = topUsers.map(topuser => ({
        ...topuser,
        isFollowed: loginUser?.Followings?.some(followingUser => followingUser.id === topuser.id)
      }))
      return res.status(200).json(data)
    } catch (err) { next(err) }
  },
  getLoginUserProfile: (req, res, next) => {
    try {
      const loginUser = helpers.getUser(req).toJSON()
      if (!loginUser) return res.status(404).json({ status: 'error', message: 'User not found!' })

      const data = {
        id: loginUser.id,
        account: loginUser.account,
        name: loginUser.name,
        email: loginUser.email,
        avatar: loginUser.avatar,
        cover: loginUser.cover,
        introduction: loginUser.introduction,
        role: loginUser.role,
        tweetCount: loginUser.Tweets.length,
        followingCount: loginUser.Followings.length,
        followerCount: loginUser.Followers.length
      }
      return res.status(200).json(data)
    } catch (err) { next(err) }
  },
  putUserSetting: async (req, res, next) => {
    try {
      const reqId = Number(req.params.id)
      const loginUserId = helpers.getUser(req).id
      const { account, name, email, password, checkPassword } = req.body
      if (!account.trim() || !name.trim() || !email.trim() || !password.trim() || !checkPassword.trim()) {
        return res.status(400).json({ status: 'error', message: 'All field are required!' })
      }
      if (!validator.isEmail(email)) {
        return res.status(422).json({ status: 'error', message: 'Email input is invalid!' })
      }
      if (password !== checkPassword) {
        return res.status(422).json({ status: 'error', message: 'Password and confirmPassword do not match.' })
      }
      if (name.length > 50) {
        return res.status(422).json({ status: 'error', message: 'Name field has max length of 50 characters.' })
      }
      if (reqId !== loginUserId) {
        return res.status(403).json({ status: 'error', message: "Cannot edit other user's setting." })
      }

      const user = await User.findByPk(reqId)
      if (!user) return res.status(404).json({ status: 'error', message: 'User not found!' })
      if (user.email === email) return res.status(422).json({ status: 'error', message: 'Email already exists!' })
      if (user.account === account) return res.status(422).json({ status: 'error', message: 'Account name already exists!' })

      const hash = await bcrypt.hash(password, 10)
      await user.update({ account, name, email, password: hash })
      return res.status(200).json({ status: 'success' })
    } catch (err) { next(err) }
  }
}

module.exports = userController

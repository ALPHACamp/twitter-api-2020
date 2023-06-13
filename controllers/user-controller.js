const { User, Tweet, Reply, Like, Followship } = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')
const { newErrorGenerate } = require('../helpers/newError-helper')
const { isUser } = require('../helpers/isUser-helper')
const { relativeTimeFromNow } = require('../helpers/dayFix-helper')
const { imgurFileHandler } = require('../helpers/file-helper')
const USERS_WORD_LIMIT = 50
const { Sequelize } = require('sequelize')
const USERS_INTRODUCTION_WORD_LIMIT = 160

const userController = {
  // token 驗證
  getTokenCheck: (req, res, next) => {
    try {
      return res.json({ success: true, error: null })
    } catch (err) {
      next(err)
    }
  },
  // 使用者註冊
  signup: async (req, res, next) => {
    try {
      const { name, account, email, password, checkPassword } = req.body
      if (!name || !account || !email || !password || !checkPassword) newErrorGenerate('所有欄位皆為必填!', 404)
      if (name?.length > USERS_WORD_LIMIT) newErrorGenerate('暱稱字數超出上限!', 404)
      if (password !== checkPassword) newErrorGenerate('密碼及確認密碼不相符!', 404)
      const userAccount = await User.findOne({ where: { account } })
      const userEmail = await User.findOne({ where: { email } })
      if (userAccount) newErrorGenerate('account 已重複註冊！', 404)
      if (userEmail) newErrorGenerate('email 已重複註冊！', 404)
      const hash = await bcrypt.hash(password, 10)
      let user = await User.create({
        name,
        account,
        email,
        password: hash,
        role: 'user'
      })
      user = user.toJSON()
      delete user.password
      return res.json({ status: 'success', data: { user } })
    } catch (err) {
      next(err)
    }
  },
  // 前台登入
  signIn: (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      if (userData?.role === 'admin') newErrorGenerate('帳號不存在！', 404)
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
      return res.json({
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
  // 查看使用者資料
  getUser: async (req, res, next) => {
    try {
      const userId = req.params.id
      const user = await User.findByPk(userId, {
        nest: true,
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })
      const tweets = await Tweet.findAll({
        where: { UserId: userId },
        raw: true
      })
      if (!user) newErrorGenerate('使用者不存在', 404)
      let userData = user.toJSON()
      const followersCount = user.Followers.length
      const followingsCount = user.Followings.length
      delete userData.Followers
      delete userData.Followings
      userData.isSignInUser = isUser(req)
      userData.tweetsCount = tweets.length
      userData = {
        ...userData,
        followersCount,
        followingsCount
      }
      return res.json(userData)
    } catch (err) {
      next(err)
    }
  },
  // 獲取使用者所寫過的推文資料
  getUserTweets: async (req, res, next) => {
    try {
      const selfUser = helpers.getUser(req).id
      const userId = req.params.id
      const user = await User.findByPk(userId, { raw: true, attributes: ['id'] })
      if (!user) newErrorGenerate('使用者不存在', 404)
      const tweets = await Tweet.findAll({
        raw: true,
        nest: true,
        where: { UserId: userId },
        attributes: [
          'id',
          'description',
          'createdAt',
          'updatedAt',
          [Sequelize.literal('(SELECT COUNT(*) FROM `Replys` WHERE `Replys`.`TweetId` = `Tweet`.`id`)'), 'repliesCount'],
          [Sequelize.literal('(SELECT COUNT(*) FROM `Likes` WHERE `Likes`.`TweetId` = `Tweet`.`id`)'), 'likesCount']
        ],
        order: [['createdAt', 'DESC']],
        include: [{ raw: true, model: User, attributes: ['id', 'name', 'account', 'avatar'] }]
      })
      const selfUserLike = await Like.findAll({ raw: true, attributes: ['TweetId'], where: { UserId: selfUser } })
      const tweetsData = tweets?.map(tweet => ({
        ...tweet,
        relativeTimeFromNow: relativeTimeFromNow(tweet.createdAt),
        isSelfUserLike: selfUserLike.some(s => s.TweetId === tweet.id)
      }))
      return res.json(tweetsData)
    } catch (err) {
      next(err)
    }
  },
  // 獲取使用者所寫過的推文回覆資料
  getUserReplies: async (req, res, next) => {
    try {
      const userId = req.params.id
      const user = await User.findByPk(userId, { raw: true, attributes: ['id', 'name', 'account', 'avatar'] })
      if (!user) newErrorGenerate('使用者不存在', 404)
      const replies = await Reply.findAll({
        where: { UserId: userId },
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: Tweet,
            attributes: ['id'],
            include: {
              model: User,
              attributes: ['account']
            }
          }
        ],
        raw: true,
        nest: true
      })
      const repliesData = replies?.map(reply => {
        reply.tweetUser = reply.Tweet.User
        reply.User = user
        reply.relativeTimeFromNow = relativeTimeFromNow(reply.createdAt)
        delete reply.Tweet
        return reply
      })
      return res.json(repliesData)
    } catch (err) {
      next(err)
    }
  },
  // 獲取使用者的like資料
  getUserLikes: async (req, res, next) => {
    try {
      const selfUser = helpers.getUser(req).id
      const userId = req.params.id
      const user = await User.findByPk(userId, { raw: true, attributes: ['id'] })
      if (!user) newErrorGenerate('使用者不存在', 404)
      const likes = await Like.findAll({
        raw: true,
        nest: true,
        where: { UserId: userId },
        order: [['createdAt', 'DESC'], ['Tweet', 'createdAt', 'DESC']],
        include: {
          model: Tweet,
          attributes: [
            'id',
            'description',
            'createdAt',
            'updatedAt',
            [Sequelize.literal('(SELECT COUNT(*) FROM `Replys` WHERE `Replys`.`TweetId` = `Tweet`.`id`)'), 'repliesCount'],
            [Sequelize.literal('(SELECT COUNT(*) FROM `Likes` WHERE `Likes`.`TweetId` = `Tweet`.`id`)'), 'likesCount']
          ],
          include: [
            { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
          ]
        }
      })
      const selfUserLike = await Like.findAll({ raw: true, attributes: ['TweetId'], where: { UserId: selfUser } })
      const likesData = likes?.map(like => {
        like.User = like?.Tweet.User
        like.Tweet.relativeTimeFromNow = relativeTimeFromNow(like?.Tweet?.createdAt)
        like.isSelfUserLike = selfUserLike.some(s => s.TweetId === like.TweetId)
        delete like.Tweet.User
        return like
      })
      return res.json(likesData)
    } catch (err) {
      next(err)
    }
  },
  // 獲取使用者所追蹤的所有人
  getUserFollowings: async (req, res, next) => {
    try {
      const userId = req.params.id
      const [user, follows] = await Promise.all([
        User.findByPk(userId, {
          raw: true,
          attributes: ['id']
        }),
        Followship.findAll({
          raw: true,
          nest: true,
          where: { followerId: userId },
          order: [['createdAt', 'DESC']],
          include: [{
            model: User,
            attributes: ['id', 'name', 'avatar', 'account', 'introduction']
          }]
        })
      ])
      if (!user) newErrorGenerate('使用者不存在', 404)
      const followsData = follows?.map(follow => ({
        ...follow,
        isSelfUserFollow: helpers?.getUser(req).Followings?.some(s => s.id === follow.followingId)
      }))
      return res.json(followsData)
    } catch (err) {
      next(err)
    }
  },
  // 獲取追蹤該使用者的所有人
  getUserFollowers: async (req, res, next) => {
    try {
      const userId = req.params.id
      const [user, follows] = await Promise.all([
        User.findByPk(userId, {
          raw: true,
          attributes: ['id']
        }),
        Followship.findAll({
          raw: true,
          nest: true,
          where: { followingId: userId },
          attributes: ['id', 'followerId', 'followingId', 'createdAt'],
          order: [['createdAt', 'DESC']]
        })
      ])
      if (!user) newErrorGenerate('使用者不存在', 404)
      const followsData = await Promise.all(follows?.map(async follow => ({
        ...follow,
        User: await User.findByPk(follow.followerId, { raw: true, attributes: ['id', 'name', 'avatar', 'account', 'introduction'] }),
        isSelfUserFollow: helpers?.getUser(req)?.Followings?.some(s => s.id === follow.followerId)
      })))
      return res.json(followsData)
    } catch (err) {
      next(err)
    }
  },
  // 使用者能編輯自己的資料
  putUser: async (req, res, next) => {
    try {
      const userId = req.params.id
      const user = await User.findByPk(userId, { attributes: ['id'] })
      if (!user) newErrorGenerate('使用者不存在', 404)
      if (!isUser(req)) newErrorGenerate('使用者非本帳號無權限編輯', 404)
      const { name, account, email, password, checkPassword, introduction } = req.body
      const { files } = req
      if (account ? await User.findOne({ attributes: ['id'], where: { account: account.trim() } }) : false) newErrorGenerate('account 已重複註冊', 404)
      if (email ? await User.findOne({ attributes: ['id'], where: { email: email.trim() } }) : false) newErrorGenerate('email 已重複註冊', 404)
      if (name?.length > USERS_WORD_LIMIT) newErrorGenerate('字數超出上限', 404)
      if (password && password !== checkPassword) newErrorGenerate('密碼與確認密碼不相符', 404)
      if (introduction?.length > USERS_INTRODUCTION_WORD_LIMIT) newErrorGenerate('字數超出上限', 404)
      const hash = password ? await bcrypt.hash(password, 10) : null
      const [fixedFile, selfUser] = await Promise.all([
        imgurFileHandler(files),
        User.findByPk(helpers.getUser(req).id)
      ])
      const avatar = fixedFile ? fixedFile[0] : null
      const backgroundImage = fixedFile ? fixedFile[1] : null
      const updatedUser = await selfUser.update({
        name: name?.trim() || selfUser.name,
        account: account?.trim() || selfUser.account,
        email: email?.trim() || selfUser.email,
        password: hash || selfUser.password,
        introduction: introduction?.trim() || selfUser.introduction,
        avatar: avatar || user.avatar,
        backgroundImage: backgroundImage || user.backgroundImage
      })
      const updatedUserJSON = updatedUser.toJSON()
      delete updatedUserJSON.password
      return res.json(updatedUserJSON)
    } catch (err) {
      next(err)
    }
  },
  // 查看推薦跟隨
  getTopUser: async (req, res, next) => {
    try {
      const TOP_USER_COUNT = req.query?.top || 10
      const selfUser = helpers.getUser(req).id
      const users = await User.findAll({
        raw: true,
        attributes: ['id', 'name', 'account', 'avatar',
          [Sequelize.literal('(SELECT COUNT(*) FROM `Followships` WHERE `Followships`.`followingId` = `User`.`id`)'), 'followersCount']],
        where: { role: { [Sequelize.Op.ne]: 'admin' }, id: { [Sequelize.Op.ne]: selfUser } }
      })
      const usersData = users
        ?.map(user => ({
          ...user,
          isUserFollowed: helpers.getUser(req)?.Followings?.some(f => f.id === user.id)
        }))
        ?.sort((a, b) => b.followersCount - a.followersCount)
        ?.slice(0, TOP_USER_COUNT)
        ?.sort((a, b) => (a.isUserFollowed === b.isUserFollowed) ? 0 : a.isUserFollowed ? -1 : 1)
      return res.json(usersData)
    } catch (err) {
      next(err)
    }
  }
}
module.exports = userController

const { Op } = require('sequelize')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const sequelize = require('sequelize')
const { User, Tweet, Reply, Like, Followship } = require('../models')
const helpers = require('../_helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')
// const { link } = require('../app')
const order = require('eslint-plugin-import/lib/rules/order')
const userController = {
  login: (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
      res.json({
        status: 'success',
        token,
        ...userData
      })
    } catch (err) {
      next(err)
    }
  },
  signUp: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    if (!account || !email || !name || !password) throw new Error('帳戶、暱稱、信箱和密碼不得為空！')
    if (password !== checkPassword) throw new Error('密碼不相符！')
    if (name.length > 50) throw new Error('超過暱稱字數上限 50 字！')
    return Promise.all([
      User.findOne({ where: { account } }),
      User.findOne({ where: { email } })
    ])
      .then(([user1, user2]) => {
        if (user1) throw new Error('account 已重複註冊！')
        if (user2) throw new Error('email 已重複註冊！')
        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({
        account,
        name,
        email,
        password: hash
      }))
      .then(newUser => {
        newUser = newUser.toJSON()
        delete newUser.password
        res.json({
          status: 'success',
          message: '成功註冊帳號！',
          ...newUser
        })
      })
      .catch(err => next(err))
  },
  getUser: (req, res, next) => {
    const id = req.params.id
    return User.findByPk(id, {
      attributes: ['id', 'account', 'name', 'email', 'introduction', 'avatar', 'cover',
        [sequelize.literal('(SELECT COUNT (*) FROM Followships WHERE Followships.following_id = User.id )'), 'followerCount'],
        [sequelize.literal('(SELECT COUNT (*) FROM Followships WHERE Followships.follower_id = User.id )'), 'followingCount'],
        [sequelize.literal('(SELECT COUNT (*) FROM Tweets WHERE Tweets.user_id = User.id )'), 'tweetCount']
      ],
      nest: true,
      raw: true
    })
      .then(user => {
        if (!user) throw new Error('使用者不存在！')
        delete user.password
        delete user.role
        res.json({
          status: 'success',
          ...user,
          isFollowed: helpers.getUser(req).Followings.some(f => f.id === user.id)
        })
      })
      .catch(err => next(err))
  },
  getCurrentUser: (req, res, next) => {
    const id = helpers.getUser(req).id
    return User.findByPk(id, {
      attributes: ['id', 'account', 'name', 'email', 'introduction', 'avatar', 'cover',
        [sequelize.literal('(SELECT COUNT (*) FROM Followships WHERE Followships.following_id = User.id )'), 'followerCount'],
        [sequelize.literal('(SELECT COUNT (*) FROM Followships WHERE Followships.follower_id = User.id )'), 'followingCount'],
        [sequelize.literal('(SELECT COUNT (*) FROM Tweets WHERE Tweets.user_id = User.id )'), 'tweetCount']
      ],
      nest: true,
      raw: true
    })
      .then(user => {
        if (!user) throw new Error('使用者不存在！')
        delete user.password
        delete user.role
        res.json({
          status: 'success',
          ...user
        })
      })
      .catch(err => next(err))
  },
  putUserAccount: (req, res, next) => {
    const id = req.params.id
    if (Number(id) !== Number(helpers.getUser(req).id)) throw new Error('只能編輯本人帳戶資料！')
    const { account, name, email, password, checkPassword } = req.body
    if (!account || !email || !name) throw new Error('帳戶、暱稱和信箱不得為空！')
    if (password !== checkPassword) throw new Error('密碼不相符！')
    if (name.length > 50) throw new Error('超過暱稱字數上限 50 字！')
    return User.findByPk(id)
      .then(async user => {
        if (!user) throw new Error('使用者不存在！')
        // 現在要更改的 account 在資料庫中不能有除了目前使用者以外相同的 account
        const user1 = await User.findOne({
          where: {
            [Op.and]: [
              { account },
              { account: { [Op.ne]: user.account } }
            ]
          }
        })
        // 現在要更改的 email 在資料庫中不能有除了目前使用者以外相同的 email
        const user2 = await User.findOne({
          where: {
            [Op.and]: [
              { email },
              { email: { [Op.ne]: user.email } }
            ]
          }
        })
        return [user1, user2, user]
      })
      .then(([user1, user2, user]) => {
        if (user1) throw new Error('account 已存在！')
        if (user2) throw new Error('email 已存在！')
        return user.update({
          account,
          name,
          email,
          password: password ? bcrypt.hashSync(password, 10) : user.password
        })
      })
      .then(user => {
        user = user.toJSON()
        delete user.password
        delete user.role
        res.json({
          status: 'success',
          message: '成功編輯帳號！',
          ...user
        })
      })
      .catch(err => next(err))
  },
  putUserProfile: (req, res, next) => {
    const id = req.params.id
    if (Number(id) !== Number(helpers.getUser(req).id)) throw new Error('只能編輯本人主頁資料！')
    const { name, introduction } = req.body
    if (!name) throw new Error('暱稱不得為空！')
    if (name.length > 50) throw new Error('超過暱稱字數上限 50 字！')
    if (introduction.length > 160) throw new Error('超過自介自數上限 160 字！')
    const avatarFile = req.files?.avatar ? req.files.avatar[0] : null
    const coverFile = req.files?.cover ? req.files.cover[0] : null
    return Promise.all([
      User.findByPk(id),
      imgurFileHandler(avatarFile),
      imgurFileHandler(coverFile)
    ])
      .then(([user, avatarPath, coverPath]) => {
        if (!user) throw new Error('使用者不存在！')
        return user.update({
          name,
          introduction,
          avatar: avatarPath || user.avatar,
          cover: coverPath || user.cover
        })
      })
      .then(user => {
        user = user.toJSON()
        delete user.password
        delete user.role
        res.json({
          status: 'success',
          message: '成功編輯主頁！',
          ...user
        })
      })
      .catch(err => next(err))
  },
  getUserLikes: (req, res, next) => {
    const userId = req.params.id
    const currentUserId = helpers.getUser(req).id
    return Like.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      include: [{
        model: Tweet,
        include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }],
        attributes: {
          include: [
            [sequelize.literal('(SELECT COUNT (*) FROM Replies WHERE Replies.tweet_id = Tweet.id )'), 'replyCount'],
            [sequelize.literal('(SELECT COUNT (*) FROM Likes WHERE Likes.tweet_id = Tweet.id )'), 'likedCount'],
            [sequelize.literal(`(SELECT COUNT (*) FROM Likes WHERE Likes.Tweet_id = Tweet.id AND Likes.user_id = ${currentUserId} > 0)`), 'isLiked']
          ]
        }
      }],
      raw: true,
      nest: true
    })
      .then(likes => {
        res.json(likes)
      })
      .catch(err => next(err))
  },
  getUserTweets: (req, res, next) => {
    const { id } = req.params
    return Tweet.findAll({
      where: { userId: id },
      order: [['createdAt', 'DESC']],
      attributes: [
        'id', 'description', 'createdAt', 'updatedAt',
        [sequelize.literal('(SELECT COUNT (*) FROM Replies WHERE Replies.Tweet_id = Tweet.id)'), 'replyCount'],
        [sequelize.literal('(SELECT COUNT (*) FROM Likes WHERE Likes.Tweet_id = Tweet.id)'), 'likedCount'],
        [sequelize.literal(`(SELECT COUNT (*) FROM Likes WHERE Likes.Tweet_id = Tweet.id AND Likes.User_id = ${id} > 0)`), 'isLiked']
      ],
      raw: true,
      nest: true
    })
      .then(tweets => {
        return res.json(
          tweets
        )
      })
      .catch(err => next(err))
  },
  getUserReplies: (req, res, next) => {
    const { id } = req.params
    return Reply.findAll({
      where: { userId: id },
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, attributes: ['id', 'account', 'name', 'avatar'] },
        { model: Tweet, include: [{ model: User, attributes: ['id', 'account', 'name'] }], attributes: ['id', 'description'] }
      ],
      raw: true,
      nest: true
    })
      .then(replies => {
        return res.json(
          replies
        )
      })
      .catch(err => (err))
  },
  getFollowers: (req, res, next) => {
    const { id } = req.params
    const user = helpers.getUser(req)
    User.findByPk(id, {
      include: [{
        model: User,
        as: 'Followers',
        attributes: ['id', 'name', 'avatar', 'introduction'],
        through: { attributes: ['createdAt'] }
      }],
      attributes: [
        'id', 'name',
        [sequelize.literal('(SELECT COUNT (*) FROM Tweets WHERE Tweets.User_id = User.id)'), 'tweetCount']
      ]
    })
      .then(data => {
        const followerData = data.Followers
        const userData = {
          id: data.id,
          name: data.name,
          tweetCount: data.dataValues.tweetCount,
          followers: followerData
            .map(follower => ({
              ...follower.toJSON(),
              isFollowed: user.Followings.some(f => f.id === follower.id)
            }))
            .sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)
        }
        return res.json(userData)
      })
      .catch(err => next(err))
  },
  getFollowings: (req, res, next) => {
    const { id } = req.params
    const user = helpers.getUser(req)
    User.findByPk(id, {
      include: [{
        model: User,
        as: 'Followings',
        attributes: ['id', 'name', 'avatar', 'introduction'],
        through: { attributes: ['createdAt'] }
      }],
      attributes: [
        'id', 'name',
        [sequelize.literal('(SELECT COUNT (*) FROM Tweets WHERE Tweets.User_id = User.id)'), 'tweetCount']
      ]
    })
      .then(data => {
        const followingData = data.Followings
        const userData = {
          id: data.id,
          name: data.name,
          tweetCount: data.dataValues.tweetCount,
          followings: followingData
            .map(following => ({
              ...following.toJSON(),
              isFollowed: user.Followings.some(f => f.id === following.id)
            }))
            .sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)
        }
        return res.json(userData)
      })
      .catch(err => next(err))
  }
}
module.exports = userController


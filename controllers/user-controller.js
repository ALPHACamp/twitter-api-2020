const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../models')
const { Op } = require('sequelize')
const { User, Tweet, Reply, Like, Followship } = db
const sequelize = require('sequelize')
const helpers = require('../_helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  login: (req, res, next) => {
    try {
      // 製作token給使用者
      const userData = req.user
      delete userData.password

      const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: '30d'
      })
      res.status(200).json({
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
  signup: async (req, res, next) => {
    try {
      // 註冊時，使用者可以設定 account、name、email 和 password
      const { account, name, email, password, checkPassword } = req.body
      if (!account.trim() || !name.trim() || !email.trim() || !password.trim() || !checkPassword.trim()) throw new Error('請輸入完整資訊!')

      // check name 不能超過50字
      if (name.length > 50) throw new Error('name 超過字數限制50字元！')

      // check password
      if (password !== checkPassword) throw new Error('密碼不相同!')

      // 檢查account, email 是否重複
      const user = await User.findOne({
        where: {
          [Op.or]: [
            { email: email },
            { account: account }
          ]
        }
      })
      if (user?.account === account) throw new Error('account 已重複註冊！')
      if (user?.email === email) throw new Error('email 已重複註冊！')
      // 創立新使用者
      await User.create({
        account,
        name,
        email,
        password: bcrypt.hashSync(password),
        role: 'user',
        createAt: new Date(),
        updatedAt: new Date()
      })
      // 回傳成功訊息
      res.json({
        status: 'success', message: '成功建立帳號'
      })
    } catch (err) {
      next(err)
    }
  },
  getUserData: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const user = await User.findByPk(req.params.id, {
        attributes: {
          exclude: ['password'],
          include: [
            [
              sequelize.literal(
                '(SELECT COUNT(*) FROM Followships WHERE followingId = User.id)'
              ),
              'followersCount'
            ],
            [
              sequelize.literal(
                '(SELECT COUNT(*) FROM Followships WHERE followerId = User.id)'
              ),
              'followingsCount'
            ]
          ]
        }
      })
      const followers = await Followship.findOne({
        where: {
          followingId: req.params.id,
          followerId: currentUserId
        }
      })
      if (!user) throw new Error('使用者不存在！')
      // reorganize user data
      const userData = {
        ...user.toJSON(),
        isCurrentUserFollowed: !!followers
      }
      res.status(200).json(userData)
    } catch (err) { next(err) }
  },
  getUserTweets: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const tweets = await Tweet.findAll({
        where: { UserId: req.params.id },
        include: [
          { model: User, attributes: { exclude: ['password'] } },
          { model: Like, attributes: ['UserId'] }
        ],
        order: [['createdAt', 'DESC']],
        nest: true,
        attributes: {
          include: [
            [
              sequelize.literal(
                '(SELECT COUNT(*) FROM Replies WHERE TweetId = Tweet.id)'
              ),
              'repliesCount'
            ],
            [
              sequelize.literal(
                '(SELECT COUNT(*) FROM Likes WHERE TweetId = Tweet.id)'
              ),
              'likesCount'
            ]
          ]
        }
      })

      const tweetsData = tweets.map(tweet => ({
        ...tweet.toJSON(),
        isCurrentUserLiked: tweet.Likes.some(like => like.UserId.toString() === currentUserId.toString())
      }))
      res.status(200).json(tweetsData)
    } catch (err) {
      next(err)
    }
  },
  getUserReplies: async (req, res, next) => {
    try {
      const replies = await Reply.findAll({
        where: { UserId: req.params.id },
        include: [
          { model: User, attributes: { exclude: ['password'] } },
          { model: Tweet }
        ],
        order: [['createdAt', 'DESC']]
      })

      const repliesData = replies.map(reply => reply.toJSON())
      res.status(200).json(repliesData)
    } catch (err) {
      next(err)
    }
  },
  getUserLikes: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const likes = await Like.findAll({
        where: {
          UserId: req.params.id
        },
        // user story規定用likes記錄成立時間排序
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: Tweet,
            include: [
              {
                model: User,
                attributes: ['id', 'account', 'name', 'avatar']
              }],
            attributes: {
              include: [
                [
                  sequelize.literal(
                    '(SELECT COUNT(*) FROM Replies WHERE TweetId = Tweet.id)'
                  ),
                  'repliesCount'
                ],
                [
                  sequelize.literal(
                    '(SELECT COUNT(*) FROM Likes WHERE TweetId = Tweet.id)'
                  ),
                  'likesCount'
                ]
              ]
            }
          }]
      })

      const likesData = likes.map(like => ({
        ...like.toJSON(),
        isCurrentUserLiked: like.UserId.toString() === currentUserId.toString()
      }))
      res.status(200).json(likesData)
    } catch (err) {
      next(err)
    }
  },
  getFollowings: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      // 使用者正在追蹤的對象
      const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['password'] }
      })
      if (!user) throw new Error('使用者不存在!')

      const followings = await Followship.findAll({
        where: { followerId: req.params.id },
        include: [
          {
            model: User,
            as: 'Following',
            attributes: { exclude: ['password'] }
          }
        ],
        order: [['createdAt', 'DESC']]
      })

      const followingsData = followings.map(following => ({
        ...following.toJSON(),
        isCurrentUserFollowed:
          following.followerId.toString() === currentUserId.toString()
      }))
      res.status(200).json(followingsData)
    } catch (err) {
      next(err)
    }
  },
  getFollowers: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      // 找出正在追蹤此使用者的其它使用者
      const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['password'] }
      })
      if (!user) throw new Error('使用者不存在!')

      const followers = await Followship.findAll({
        where: { followingId: req.params.id },
        include: [
          {
            model: User,
            as: 'Follower',
            attributes: { exclude: ['password'] }
          }
        ],
        order: [['createdAt', 'DESC']]
      })

      const followersData = followers.map(follower => ({
        ...follower.toJSON(),
        isCurrentUserFollowed:
          follower.followerId.toString() === currentUserId.toString()
      }))
      res.status(200).json(followersData)
    } catch (err) {
      next(err)
    }
  },
  putUserSetting: async (req, res, next) => {
    try {
      // 使用者僅能編輯自己的資料
      const currentUser = helpers.getUser(req)
      const currentUserId = helpers.getUser(req).id
      if (currentUserId.toString() !== req.params.id) { throw new Error('你沒有權限可以編輯他人資料') }

      // 使用者能編輯自己的 account、name、email 和 password
      const { account, name, email, password, checkPassword, introduction } = req.body

      // 暱稱上限 50 字
      if (name && name.length > 50) throw new Error('name 超過字數限制50字元!')

      // 自我介紹上限 160字
      if (introduction && introduction.length > 160) { throw new Error('introduction 超過字數限制160字元!') }

      // check password
      if (password !== checkPassword) throw new Error('密碼不相同')

      // 檢查account, email 是否重複
      if (email || account) {
        const checkUser = await User.findOne({
          where: {
            [Op.or]: [email ? { email } : {}, account ? { account } : {}]
          }
        })
        if (account !== currentUser.account && checkUser?.account === account) throw new Error('account 已重複註冊！')
        if (email !== currentUser.email && checkUser?.email === email) throw new Error('email 已重複註冊！')
      }

      const user = await User.findByPk(req.params.id)
      // 更新使用者資訊
      await user.update({
        account: account || user.account,
        name: name || user.name,
        email: email || user.email,
        password: password ? bcrypt.hashSync(password) : user.password,
        introduction: introduction || user.introduction
      })

      // 回傳成功訊息
      res.status(200).json({
        status: 'success',
        message: '成功編輯帳號資訊'
      })
    } catch (err) {
      next(err)
    }
  },
  putUserProfile: async (req, res, next) => {
    try {
      // 使用者僅能編輯自己的資料
      const currentUserId = helpers.getUser(req).id
      if (currentUserId.toString() !== req.params.id) {
        throw new Error('你沒有權限可以編輯他人資料')
      }
      const { name, introduction } = req.body
      const { files } = req

      // 自我介紹字數上限 160 字、暱稱上限 50 字
      if (name && name.length > 50) throw new Error('name 超過字數限制50字元!')
      if (introduction && introduction.length > 160) { throw new Error(' introduction 超過字數限制160字元!') }

      const user = await User.findByPk(req.params.id)
      if (!user) throw new Error('使用者不存在!')

      const avatar = files?.avatar ? await imgurFileHandler(files.avatar[0]) : null

      const cover = files?.cover ? await imgurFileHandler(files.cover[0]) : null

      await user.update({
        name: name || user.name,
        introduction: introduction || user.introduction,
        avatar: avatar || user.avatar,
        cover: cover || user.cover
      })

      res.status(200).json({
        status: 'success',
        message: '成功編輯使用者Profile'
      })
    } catch (err) {
      next(err)
    }
  },
  getTopFollower: async (req, res, next) => {
    try {
      // get current login user data
      const currentUserId = helpers.getUser(req).id
      // find top 10 followers users
      const users = await User.findAll({
        attributes: {
          exclude: ['password'],
          include: [
            [
              sequelize.literal(
                '(SELECT COUNT(*) as followersCount FROM Followships WHERE followingId = User.id ORDER BY followersCount)'
              ),
              'followersCount'
            ]
          ]
        },
        include: {
          model: User,
          as: 'Followers',
          attributes: ['id']
        },
        // 排除目前的使用者
        where: { id: { [sequelize.Op.not]: currentUserId } },
        order: [
          [sequelize.literal('followersCount'), 'DESC']
        ],
        limit: 10
      })

      // reorganize user data
      const topUsersData = users.map(user => ({
        ...user.toJSON(),
        isCurrentUserFollowed: user.Followers.map(follower => follower.id).some(id => id.toString() === currentUserId.toString())
      }))
      res.status(200).json(topUsersData)
    } catch (err) {
      next(err)
    }
  }
}
module.exports = userController

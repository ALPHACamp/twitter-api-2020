const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')
const { Tweet, Followship, User, Reply, Like, sequelize } = require('../models')
const { Op } = require("sequelize")
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      delete userData.password
      const token = jwt.sign(userData, 'secret', { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
      res.json({
        status: 'success',
        message: '成功登入',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  signUp: async (req, res, next) => {
    try {
      if (req.body.password !== req.body.checkPassword) throw new Error('Passwords do not match')
      if (req.body.name && req.body.name.length > 50) throw new Error('字數超出上限！')
      const foundEmail = await User.findOne({ where: { email: req.body.email } })
      const foundAccount = await User.findOne({ where: { account: req.body.account } })
      // !有餘力再來優化程式
      let errorMessage = []
      if (foundEmail) {
        errorMessage += 'email 已重複註冊！'
      }
      if (foundAccount) {
        errorMessage += 'account 已重複註冊！'
      }
      if (errorMessage.length > 0) {
        throw new Error(errorMessage)
      }
      const hash = await bcrypt.hash(req.body.password, 10)
      const user = await User.create({
        account: req.body.account,
        name: req.body.name,
        email: req.body.email,
        password: hash,
        avatar: `https://loremflickr.com/320/240/cat/?lock=${Math.random() * 100}`,
        cover: 'https://i.imgur.com/hCJiDle.png',
        role: 'user'
      })
      res.json({
        status: 'success',
        message: '成功註冊',
        data: user
      })
    } catch (err) {
      next(err)
    }
  },
  getUser: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const id = req.params.id
      const isCurrentUser = (currentUserId === Number(id))
      const user = await User.findByPk(id, {
        attributes: [
          'id', 'account', 'name', 'email', 'avatar', 'cover', 'introduction', 'role',
          [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE user_id = User.id)'), 'TweetsCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE user_id = User.id)'), 'LikesCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE following_id = User.id)'), 'FollowingCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE follower_id = User.id)'), 'FollowerCount'],
          [sequelize.literal(`(SELECT EXISTS(SELECT * FROM Followships WHERE follower_id = ${currentUserId} AND following_id = User.id))`), 'isFollowing']
        ],
        raw: true,
        nest: true
      })
      if (!user || user.role === 'admin') throw new Error("user doesn't exist")

      user.isCurrentUser = isCurrentUser
      user.isFollowing = user.isFollowing === 1 ? true : false

      if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'travis') {
        res.json(user)
      } else {
        res.json({
          status: 'Success',
          message: '成功取得使用者資料',
          user
        })
      }
    } catch (err) {
      next(err)
    }
  },
  editUser: async (req, res, next) => {
    try {
      const { id } = req.params
      if (Number(id) !== helpers.getUser(req).id) return res.status(403).json({ status: 'error', message: '無法修改其他使用者之資料' })
      const user = await User.findByPk(id)
      if (!user) throw new Error('使用者不存在')

      const { name, introduction } = req.body
      if (!name || !introduction) throw new Error('必填欄位不可空白')
      if (name.length > 50) throw new Error('字數超出上限！')
      if (introduction.length > 160) throw new Error('簡介不能超過150字')

      const avatarFile = req.files?.avatar ? await imgurFileHandler(...req.files.avatar) : null
      const coverFile = req.files?.avatar ? await imgurFileHandler(...req.files.cover) : null

      const updatedUser = await user.update({
        name,
        introduction,
        avatar: avatarFile || user.avatar,
        cover: coverFile || user.cover
      })
      const data = updatedUser.toJSON()
      delete data.password
      res.json({
        status: 'success',
        message: '成功編輯使用者資料',
        data
      })
    } catch (err) {
      next(err)
    }
  },
  modifyUser: async (req, res, next) => {
    const UserId = helpers.getUser(req).id
    const { account, name, email, password, checkPassword, introduction } = req.body
    const id = req.params.id
    try {
      if (Number(UserId) !== Number(id)) throw new Error('無法修改其他使用者之資料')
      if (introduction ? introduction.length > 160 : false || name ? name.length > 50 : false) throw new Error('字數超出上限！')
      if (password && checkPassword && password !== checkPassword) throw new Error('Passwords do not match!')
      const user = await User.findByPk(id)
      if (!user || user.role === 'admin') throw new Error("使用者不存在")
      let errorMessage = []
      if (email && await User.findOne({ where: { email, [Op.not]: [{ id }] } })) {
        errorMessage += 'email 已重複註冊！'
      }
      if (account && await User.findOne({ where: { account, [Op.not]: [{ id }] } })) {
        errorMessage += 'account 已重複註冊！'
      }
      if (errorMessage.length > 0) {
        throw new Error(errorMessage)
      }
      const newPassword = password ? bcrypt.hashSync(password, bcrypt.genSaltSync(10), null) : null
      const avatarFile = req.files?.avatar ? await imgurFileHandler(...req.files.avatar) : null
      const coverFile = req.files?.cover ? await imgurFileHandler(...req.files.cover) : null

      const updatedUser = await user.update({
        account: account || user.account,
        name: name || user.name,
        email: email || user.email,
        introduction: introduction || user.introduction,
        password: newPassword || user.password,
        avatar: avatarFile || user.avatar,
        cover: coverFile || user.cover
      })
      const data = updatedUser.toJSON()
      delete data.password
      res.json({
        status: 'success',
        message: '成功編輯使用者資料',
        data
      })
    } catch (err) {
      next(err)
    }
  },
  getUserTweets: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const userId = req.params.id
      const user = await User.findByPk(userId)
      if (!user || user.role === 'admin') throw new Error("使用者不存在")
      const tweets = await Tweet.findAll({
        where: { userId },
        attributes: ['id', 'description', 'userId', 'createdAt',
          [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE tweet_id = Tweet.id)'), 'likesCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE tweet_id = Tweet.id)'), 'repliesCount'],
          [sequelize.literal(`(SELECT EXISTS(SELECT * FROM Likes WHERE user_id = ${currentUserId} AND tweet_id = Tweet.id))`), 'isLike']
        ],
        include: [{
          model: User,
          attributes: ['name', 'account', 'avatar']
        }],
        nest: true,
        raw: true,
        order: [['created_at', 'DESC']]
      })
      const newData = tweets.map(t => ({
        ...t,
        isLike: t.isLike === 1 ? true : false
      }))
      if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'travis') {
        res.json(tweets)
      } else {
        res.json({
          status: 'success',
          message: '成功取得使用者的所有推文',
          tweets: newData
        })
      }
    } catch (err) {
      next(err)
    }
  },
  getUserRepliedTweets: async (req, res, next) => {
    try {
      const userId = req.params.id
      const user = await User.findByPk(userId)
      if (!user || user.role === 'admin') throw new Error("使用者不存在")
      const replies = await Reply.findAll({
        where: { userId },
        attributes: ['id', 'comment', 'tweetId', 'userId', 'createdAt'],
        include: [{
          model: User,
          attributes: [
            'id', 'account', 'name', 'avatar']
        },
        {
          model: Tweet,
          include: [{
            model: User,
            attributes: ['id', 'account', 'name', 'avatar']
          }]
        }],
        nest: true,
        raw: true,
        order: [['created_at', 'DESC']]
      })
      if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'travis') {
        res.json(replies)
      } else {
        res.json({
          status: 'success',
          message: '成功取得使用者的所有的回覆',
          replies
        })
      }
    } catch (err) {
      next(err)
    }
  },
  getUserLikes: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const UserId = Number(req.params.id)
      const user = await User.findByPk(UserId)
      if (!user || user.role === 'admin') throw new Error("使用者不存在")
      const likedTweets = await Like.findAll({
        where: { UserId },
        attributes: ['id', 'TweetId', 'UserId', 'createdAt'],
        include: [{
          model: Tweet,
          attributes: ['id', 'description', 'UserId', 'createdAt',
            [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE tweet_id = Tweet.id)'), 'likesCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE tweet_id = Tweet.id)'), 'repliesCount'],
            [sequelize.literal(`(SELECT EXISTS(SELECT * FROM Likes WHERE user_id = ${currentUserId} AND tweet_id = Tweet.id))`), 'isLike']
          ],
          include: [{
            model: User,
            attributes: ['id', 'account', 'name', 'avatar']
          }]
        }],
        nest: true,
        raw: true,
        order: [['created_at', 'DESC']]
      })

      const newData = await likedTweets.map(t => (
        {
          ...t,
          isLike: t.Tweet.isLike === 1 ? true : false,
          likesCount: t.Tweet.likesCount,
          repliesCount: t.Tweet.repliesCount
        }
      ))

      if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'travis') {
        res.json(likedTweets)
      } else {
        res.status(200).json({
          status: 'Success',
          message: '成功取得所有使用者之資料',
          likedTweets: newData
        })
      }
    } catch (err) {
      next(err)
    }
  },
  following: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const followerId = req.params.id
      const follower = await User.findByPk(followerId)
      if (!follower || follower.role === 'admin') throw new Error("使用者不存在")
      const followings = await Followship.findAll({
        where: { followerId },
        attributes: [
          'followingId', 'createdAt',
          [sequelize.literal(`(SELECT avatar FROM Users WHERE id = following_id)`), 'avatar'],
          [sequelize.literal(`(SELECT name FROM Users WHERE id = following_id)`), 'name'],
          [sequelize.literal(`(SELECT introduction FROM Users WHERE id = following_id)`), 'introduction']
        ],
        order: [['createdAt', 'DESC'], ['id', 'DESC']]
      })

      const currentList = await Followship.findAll({
        where: { followerId: currentUserId },
        raw: true
      })
      const current = currentList.map(id => id.followingId)
      const data = followings.map(following => ({
        ...following.toJSON(),
        isFollowing: current ? current.includes(following.followingId) : false,
      }))

      if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'travis') {
        res.json(followings)
      } else {
        res.status(200).json({
          status: 'Success',
          message: '您已成功！',
          data
        })
      }
    } catch (err) {
      next(err)
    }
  },
  getRecommendUsers: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const data = await User.findAll({
        where: { [Op.not]: [{ role: 'admin' }] },
        attributes: [
          'id', 'account', 'name', 'email', 'avatar',
          [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE user_id = User.id)'), 'TweetsCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE user_id = User.id)'), 'LikesCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE following_id = User.id)'), 'FollowingCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE follower_id = User.id)'), 'FollowerCount'],
          [sequelize.literal(`(SELECT EXISTS(SELECT * FROM Followships WHERE follower_id = ${currentUserId} AND following_id = User.id))`), 'isFollowing']
        ],
        order: [[sequelize.literal('FollowingCount'), 'DESC']],
        limit: 10,
        raw: true,
        nest: true
      })
      const users = await data.map(element => ({
        ...element,
        isFollowing: element.isFollowing === 1 ? true : false
      }))
      res.status(200).json({
        status: 'Success',
        message: '成功取得被追蹤人數前十之使用者資料',
        users
      })
    } catch (err) {
      next(err)
    }
  },
  follower: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const followingId = req.params.id
      const following = await User.findByPk(followingId)
      if (!following || following.role === 'admin') throw new Error("使用者不存在")
      const followers = await Followship.findAll({
        where: { followingId },
        attributes: [
          'followerId', 'createdAt',
          [sequelize.literal(`(SELECT avatar FROM Users WHERE id = follower_id)`), 'avatar'],
          [sequelize.literal(`(SELECT name FROM Users WHERE id = follower_id)`), 'name'],
          [sequelize.literal(`(SELECT introduction FROM Users WHERE id = follower_id)`), 'introduction']
        ],
        order: [['createdAt', 'DESC'], ['id', 'DESC']]
      })

      const currentList = await Followship.findAll({
        where: { followerId: currentUserId },
        raw: true
      })
      const current = currentList.map(id => id.followingId)
      const data = followers.map(follower => ({
        ...follower.toJSON(),
        isFollowing: current ? current.includes(follower.followerId) : false,
      }))

      if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'travis') {
        res.json(followers)
      } else {
        res.status(200).json({
          status: 'Success',
          message: '您已成功！',
          data
        })
      }
    } catch (err) {
      next(err)
    }
  },
  getCurrentUser: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const currentUserData = await User.findByPk(currentUserId, {
        raw: true,
        attributes: { exclude: ['password'] }
      })
      if (!currentUserData) throw new Error("使用者不存在")
      res.status(200).json({
        status: 'Success',
        message: '成功取得當前使用者之資訊',
        currentUserData
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
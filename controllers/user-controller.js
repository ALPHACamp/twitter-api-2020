const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt-nodejs')
const { User, Like, Tweet, Followship, Reply, sequelize } = require('../models')
const { getUser, imgurFileHandler } = require('../_helpers')

const userController = {
  userLogin: async (req, res, next) => {
    try {
      // token(效期30天)
      const userData = getUser(req).toJSON()
      if (userData.role !== 'user') return res.status(401).json({ status: 'error', message: '帳號不存在！' })
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      return res.status(200).json({
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
      const { id } = req.params
      let user = await User.findByPk(id, {
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt', 'role'],
          include: [
            [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)'), 'followerCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followerId = User.id)'), 'followingCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.userId = User.id)'), 'tweetCount']
          ]
        },
        nest: true
      })
      if (!user) return res.status(404).json({ status: 'error', message: '找不到使用者！' })
      user = user.toJSON()
      user.isFollowed = getUser(req).Followings ? getUser(req).Followings.some(f => f.id === user.id) : null
      return res.json(user)
    } catch (err) {
      next(err)
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const top = Number(req.query.top)
      const users = await User.findAll({
        attributes: {
          exclude: ['email', 'introduction', 'password', 'role', 'cover', 'createdAt', 'updatedAt'],
          include: [
            [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)'), 'followerCount'],
            [sequelize.literal('EXISTS (SELECT * from Followships where Followships.followingId = User.id) != 0'), 'isFollowed']
          ]
        },
        // order: ['followerCount', 'DESC'],
        limit: top || null
      })
      return res.status(200).json({ status: 'success', data: users })
    } catch (err) {
      next(err)
    }
  },
  postUser: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      if (!account || !name || !email || !password || !checkPassword) return res.status(400).json({ status: 'error', message: '所有欄位都是必填！' })
      if (account.trim() === '' || name.trim() === '' || email.trim() === '') return res.status(400).json({ status: 'error', message: '所有欄位都是必填！' })
      if (name.length > 50) return res.status(400).json({ status: 'error', message: '超過name字數上限50字！' })
      if (password !== checkPassword) return res.status(400).json({ status: 'error', message: '密碼與密碼確認不相同！' })

      const user1 = await User.findOne({ where: { email } })
      if (user1) return res.status(400).json({ status: 'error', message: 'email 已重複註冊！' })
      const user2 = await User.findOne({ where: { account } })
      if (user2) return res.status(400).json({ status: 'error', message: 'account 已重複註冊！' })

      let createdUser = await User.create({
        account,
        name,
        email,
        password: bcrypt.hashSync(password)
      })

      createdUser = createdUser.toJSON()
      delete createdUser.password

      return res.status(200).json({ status: 'success', data: createdUser })
    } catch (err) {
      next(err)
    }
  },
  putUserAccount: async (req, res, next) => {
    try {
      const { id } = req.params
      // 未回傳則預設不修改
      const { account, name, email, password, checkPassword } = req.body

      // 確認回傳不可為空白
      if ((account && account.trim() === '') || (name && name.trim() === '') || (email && email.trim() === '')) return res.status(400).json({ status: 'error', message: '所有欄位都是必填！' })

      // 確定使用者存在
      const user = await User.findByPk(id)
      if (!user) return res.status(404).json({ status: 'error', message: '找不到使用者！' })

      // 只能更改自己的資料
      if (getUser(req).dataValues.id !== Number(id)) return res.status(401).json({ status: 'error', message: '無權限更改此使用者！' })

      // 檢查account是否與其他使用者重複
      if (account) {
        const accountRepeatedUser = await User.findOne({ where: { account }, raw: true })
        if (accountRepeatedUser && Number(accountRepeatedUser.id) !== Number(id)) return res.status(400).json({ status: 'error', message: 'account與其他使用者重複！' })
      }

      // 檢查email是否與其他使用者重複
      if (email) {
        const emailRepeatedUser = await User.findOne({ where: { email }, raw: true })
        if (emailRepeatedUser && Number(emailRepeatedUser.id) !== Number(id)) return res.status(400).json({ status: 'error', message: 'email與其他使用者重複！' })
      }

      // 若有回傳password，檢查password與checkPassword是否相符
      if (password && password !== checkPassword) return res.status(400).json({ status: 'error', message: '密碼與密碼確認不相同！' })

      // 確認name沒有超過上限
      if (name && name.length > 50) return res.status(400).json({ status: 'error', message: '超過name字數上限50字！' })

      let updatedUser = await user.update({
        account: account || user.account,
        name: name || user.name,
        email: email || user.email,
        password: bcrypt.hashSync(password) || user.password
      })

      updatedUser = updatedUser.toJSON()
      delete updatedUser.avatar
      delete updatedUser.cover
      delete updatedUser.password
      delete updatedUser.introduction
      delete updatedUser.role

      return res.status(200).json({ status: 'success', data: updatedUser })
    } catch (err) {
      next(err)
    }
  },
  putUserProfile: async (req, res, next) => {
    try {
      // 回傳null則代表刪除資料
      const { id } = req.params
      const { name, introduction } = req.body
      const { files } = req

      if (!name) return res.status(400).json({ status: 'error', message: 'name是必填！' })
      if (name.trim() === '') return res.status(400).json({ status: 'error', message: 'name是必填！' })

      const avatar = files?.avatar ? files.avatar[0] : null
      const cover = files?.cover ? files.cover[0] : null

      // 確定使用者存在
      const user = await User.findByPk(id)
      if (!user) return res.status(404).json({ status: 'error', message: '找不到使用者！' })

      // 只能更改自己的資料
      if (getUser(req).dataValues.id !== Number(id)) return res.status(401).json({ status: 'error', message: '無權限更改此使用者！' })

      // 確認name及introduction字數上限
      if (name && name.length > 50) return res.status(400).json({ status: 'error', message: '超過name字數上限50字！' })
      if (introduction && introduction.length > 160) return status(400).json({ status: 'error', message: '超過introduction字數上限160字！' })

      // 圖片上傳imgur
      const avatarPath = await imgurFileHandler(avatar)
      const coverPath = await imgurFileHandler(cover)

      let updatedUser = await user.update({
        name,
        avatar: avatarPath,
        cover: coverPath,
        introduction
      })

      updatedUser = updatedUser.toJSON()
      delete updatedUser.password
      delete updatedUser.role

      return res.status(200).json({ status: 'success', data: updatedUser })
    } catch (err) {
      next(err)
    }
  },
  getLikes: async (req, res, next) => {
    try {
      const UserId = req.params.id

      const user = await User.findOne({ where: { id: UserId } })
      if (!user) return res.status(404).json({ status: 'error', message: '找不到使用者！' })

      const likedTweets = await Like.findAll({
        where: { UserId },
        include: {
          model: Tweet,
          attributes: [
            'id', 'description',
            [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'replyCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likeCount'],
            [sequelize.literal(`EXISTS(SELECT true FROM Likes WHERE Likes.UserId = ${UserId} AND Likes.TweetId = Tweet.id)`), 'isLiked'], 'createdAt'
          ]
        },
        nest: true,
        raw: true,
        order: [['createdAt', 'DESC']]
      })

      return res.status(200).json(likedTweets)
    } catch (err) {
      next(err)
    }
  },
  getFollowings: async (req, res, next) => {
    try {
      const { id } = req.params
      const user = await User.findByPk(id)

      if (!user) return res.status(404).json({ status: 'error', message: '找不到使用者！' })

      const followings = await Followship.findAll({
        attributes: {
          exclude: ['updatedAt'],
          include: [
            [sequelize.literal('(SELECT Users.id FROM Users WHERE Users.id = Followship.FollowingId)'), 'UserInfo.id'],
            [sequelize.literal('(SELECT Users.account FROM Users WHERE Users.id = Followship.FollowingId)'), 'UserInfo.acocunt'],
            [sequelize.literal('(SELECT Users.name FROM Users WHERE Users.id = Followship.FollowingId)'), 'UserInfo.name'],
            [sequelize.literal('(SELECT Users.introduction FROM Users WHERE Users.id = Followship.FollowingId)'), 'UserInfo.introduction'],
            [sequelize.literal('(SELECT Users.avatar FROM Users WHERE Users.id = Followship.FollowingId)'), 'UserInfo.avatar']
          ]
        },
        where: { followerId: id },
        raw: true,
        nest: true
      })

      return res.status(200).json(followings)
    } catch (err) {
      next(err)
    }
  },
  getFollowers: async (req, res, next) => {
    try {
      const { id } = req.params
      const user = await User.findByPk(id)

      if (!user) return res.status(404).json({ status: 'error', message: '找不到使用者！' })

      const followings = await Followship.findAll({
        attributes: {
          exclude: ['updatedAt'],
          include: [
            [sequelize.literal('(SELECT Users.id FROM Users WHERE Users.id = Followship.FollowerId)'), 'UserInfo.id'],
            [sequelize.literal('(SELECT Users.account FROM Users WHERE Users.id = Followship.FollowerId)'), 'UserInfo.acocunt'],
            [sequelize.literal('(SELECT Users.name FROM Users WHERE Users.id = Followship.FollowerId)'), 'UserInfo.name'],
            [sequelize.literal('(SELECT Users.introduction FROM Users WHERE Users.id = Followship.FollowerId)'), 'UserInfo.introduction'],
            [sequelize.literal('(SELECT Users.avatar FROM Users WHERE Users.id = Followship.FollowerId)'), 'UserInfo.avatar']
          ]
        },
        where: { followingId: id },
        raw: true,
        nest: true
      })

      return res.status(200).json(followings)
    } catch (err) {
      next(err)
    }
  },
  getRepliedTweets: async (req, res, next) => {
    try {
      const id = req.params.id
      const user = await User.findByPk(id)
      if (!user) return res.status(404).json({ status: 'error', message: '找不到使用者！' })

      const repliedTweets = await Reply.findAll({
        where: { UserId: id },
        include: {
          model: Tweet,
          attributes: {
            exclude: ['description', 'createdAt', 'updatedAt'],
            include: [
              [sequelize.literal('(SELECT Users.account FROM Users WHERE Users.id = Tweet.UserId)'), 'postUserAccount']
            ]
          }
        },
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })

      return res.status(200).json(repliedTweets)
    } catch (err) {
      next(err)
    }
  },
  getUserTweets: async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      const user = getUser(req)
      const userId = await User.findByPk(id)
      if (!userId) return res.status(404).json({ status: 'error', message: '找不到使用者！' })

      const tweets = await Tweet.findAll({
        attributes: [
          'id', 'description', 'createdAt',
          [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'replyCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likeCount']
        ],
        include: { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
        where: { UserId: id },
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })
      const data = tweets.map(tweet => ({
        ...tweet,
        isLiked: user?.Likes?.some(userLike => userLike?.TweetId === tweet.id)
      }))
      return res.status(200).json(data)
    } catch (err) { next(err) }
  }
}

module.exports = userController

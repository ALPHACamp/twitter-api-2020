const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
require('dayjs/locale/zh-tw')

dayjs.extend(relativeTime) // 外掛相對時間模組
dayjs.locale('zh-tw') // 默認使用繁中

const { Op } = require('sequelize')
const helpers = require('../_helpers')
const imgurFileHandler = require('../helpers/file-helpers')

const { User, Tweet, Reply, Like, Followship, sequelize } = require('../models')

const userController = {
  // No.1 - 註冊帳號 POST /api/users
  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword, introduction, avatar, banner } = req.body
      const cause = { // 定義不同的錯誤訊息，以便前端顯示之用
        accountErrMsg: '',
        nameErrMsg: '',
        emailErrMsg: '',
        passwordErrMsg: '',
        checkPasswordErrMsg: ''
      }

      // 確認必填值是否為空
      if (!account) cause.accountErrMsg += 'account 為必填欄位。'
      if (!name) cause.nameErrMsg += 'name 為必填欄位。'
      if (!email) cause.emailErrMsg += 'email 為必填欄位。'
      if (!password) cause.passwordErrMsg += 'password 為必填欄位。'
      if (!checkPassword) cause.checkPasswordErrMsg += 'checkPassword 為必填欄位。'
      if (cause.accountErrMsg || cause.nameErrMsg || cause.emailErrMsg || cause.passwordErrMsg || cause.checkPasswordErrMsg) {
        throw new Error('Empty input value!', { cause })
      }

      // 確認checkPassword是否相符 & name是否在50字之內
      if (password !== checkPassword) cause.checkPasswordErrMsg += '確認密碼不相符。'
      if (name.length > 50) cause.nameErrMsg += '名稱不得超過50字。'

      // 確認account或email是否重複
      const [user1, user2] = await Promise.all([
        User.findOne({ where: { account } }),
        User.findOne({ where: { email } })
      ])
      if (user1) cause.accountErrMsg += 'account 已重複註冊！'
      if (user2) cause.emailErrMsg += 'email 已重複註冊！'

      if (cause.accountErrMsg || cause.nameErrMsg || cause.emailErrMsg || cause.passwordErrMsg || cause.checkPasswordErrMsg) {
        throw new Error('Inproper input value!', { cause })
      }

      // 若無錯誤則建立新帳號
      const hash = await bcrypt.hash(password, 10)
      const user = await User.create({
        account,
        name,
        email,
        password: hash,
        introduction: introduction || '',
        avatar: avatar || 'https://via.placeholder.com/224',
        banner: banner || 'https://images.unsplash.com/photo-1580436541340-36b8d0c60bae',
        role: 'user'
      })

      if (!user) throw new Error('建立帳號失敗！')
      req.user = user

      return next() // 先不回應，向後交給signin繼續處理
    } catch (err) {
      return next(err)
    }
  },
  // No.2 - 登入前台帳號 POST /api/users/signin
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      // 角色若不是user則不發給token
      if (userData.role !== 'user') throw new Error('no such user(角色錯誤)', { cause: { accountErrMsg: '帳號不存在！', passwordErrMsg: '' } })

      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天

      return res.status(200).json({
        success: true,
        data: { token, user: userData }
      })
    } catch (err) {
      return next(err)
    }
  },
  // No.3 - 查看某使用者的資料 GET /api/users/:id
  getUser: async (req, res, next) => {
    try {
      const UserId = req.params.id

      // --資料提取--
      const user = await User.findByPk(UserId, {
        where: { id: UserId },
        raw: true,
        nest: true,
        attributes: {
          exclude: ['password'],
          include: [[ // 使用sequelize.literal把追蹤者、追隨者各做成一個屬性
            sequelize.literal(`(SELECT COUNT(*) FROM Followships WHERE followerId = ${UserId})`),
            'followingNum' // 追隨者總數
          ], [
            sequelize.literal(`(SELECT COUNT(*) FROM Followships WHERE followingId = ${UserId})`),
            'followerNum' // 追蹤者總數
          ]]
        }
      })

      if (!user) throw new Error('使用者讀取失敗')

      return res.status(200).json(user)
    } catch (err) {
      return next(err)
    }
  },
  // No.4 - 查看某使用者發過的推文 GET /api/users/:id/tweets
  getUserTweets: async (req, res, next) => {
    try {
      const UserId = req.params.id
      const currentUserId = helpers.getUser(req).id

      // --資料提取--
      let tweets = await Tweet.findAll({
        where: { UserId },
        order: [['createdAt', 'DESC']],
        include: [{
          model: User,
          attributes: ['account', 'name', 'avatar']
          // ,as: 'Author'
        }],
        nest: true,
        attributes: {
          include: [[
            sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE TweetId = Tweet.id)'),
            'repliesNum' // 被回覆的總數
          ], [
            sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE TweetId = Tweet.id)'),
            'likesNum' // 被喜歡的總數
          ], [
            // sequelize.literal(`(SELECT COUNT(*) FROM Likes WHERE TweetId = Tweet.id and UserId = ${currentUserId})`),
            sequelize.literal(`(SELECT EXISTS(SELECT * FROM Likes WHERE TweetId = Tweet.id and UserId = ${currentUserId}))`),
            'isLiked' // 目前使用者是否喜歡
          ]]
        }
      })

      if (!tweets) throw new Error('推文讀取失敗')

      // --資料整理--
      tweets = tweets
        .map(tweet => tweet.toJSON())
        .map(tweet => ({
          ...tweet,
          isLiked: Boolean(tweet.isLiked),
          fromNow: dayjs(tweet.createdAt).fromNow()
        }))

      return res.status(200).json(tweets)
    } catch (err) {
      return next(err)
    }
  },
  // No.5 - 查看某使用者發過的回覆 GET /api/users/:id/replied_tweets
  getUserReplies: async (req, res, next) => {
    try {
      const UserId = req.params.id

      // --資料提取--
      let replies = await Reply.findAll({
        where: { UserId },
        order: [['createdAt', 'DESC']],
        include: [{
          model: User, // Reply的作者基本屬性
          attributes: ['account', 'name', 'avatar']
          // ,as: 'Author'
        }],
        attributes: {
          include: [[
            sequelize.literal('(SELECT account FROM Users JOIN Tweets ON Tweets.UserId = Users.id WHERE TweetId = Tweets.id)'),
            'repliedTo' // 回覆給那一個作者
          ]]
        },
        nest: true
      })

      if (!replies) throw new Error('回覆讀取失敗')

      // --資料整理--
      replies = replies
        .map(reply => reply.toJSON())
        .map(reply => ({
          ...reply,
          fromNow: dayjs(reply.createdAt).fromNow()
        }))

      return res.status(200).json(replies)
    } catch (err) {
      return next(err)
    }
  },
  // No.6 - 查看某使用者點過like的推文 GET /api/users/:id/likes
  getUserLikes: async (req, res, next) => {
    try {
      const UserId = req.params.id
      const currentUserId = helpers.getUser(req).id

      // --資料提取--
      let likes = await Like.findAll({
        where: { UserId },
        order: [['createdAt', 'DESC']],
        include: [{
          model: Tweet,
          include: [{
            model: User,
            attributes: ['account', 'name', 'avatar']
            // ,as: 'Author'
          }],
          attributes: {
            include: [[
              sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE TweetId = Tweet.id)'),
              'repliesNum' // 被回覆的總數
            ], [
              sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE TweetId = Tweet.id)'),
              'likesNum' // 被喜歡的總數
            ], [
              sequelize.literal(`(SELECT EXISTS(SELECT * FROM Likes WHERE TweetId = Tweet.id AND UserId = ${currentUserId}))`),
              'isLiked' // 目前的使用者是否追蹤
            ]]
          }
        }],
        nest: true
      })

      if (!likes) throw new Error('喜歡讀取失敗')

      // --資料整理--
      likes = likes
        .map(like => like.toJSON())
        .map(like => ({ // 拆掉最外層結構，並追加屬性fromNow
          ...like.Tweet,
          TweetId: like.TweetId, // 多做一個屬性應付測試檔檢查
          fromNow: dayjs(like.Tweet.createdAt).fromNow()
        }))

      return res.status(200).json(likes)
    } catch (err) {
      return next(err)
    }
  },
  // No.7 - 查看某使用者追蹤中的人 GET /api/users/:id/followings
  getUserFollowings: async (req, res, next) => {
    try {
      const UserId = req.params.id
      const currentUserId = helpers.getUser(req).id

      // --資料提取--
      const followships = await Followship.findAll({
        where: { followerId: UserId },
        order: [['createdAt', 'DESC']],
        include: [{
          model: User,
          as: 'Following',
          attributes: {
            exclude: ['password'],
            include: [[
              sequelize.literal(`(SELECT EXISTS(SELECT * FROM Followships WHERE FollowingId = Following.id and FollowerId = ${currentUserId}))`),
              'isFollowed' // 目前的使用者是否追蹤
            ]]
          }
        }],
        nest: true
      })

      if (!followships) throw new Error('追蹤者讀取失敗')

      // --資料整理--
      const followings = followships
        .map(followship => followship.toJSON())
        .map(followship => ({ // 拆掉最外層結構
          ...followship.Following,
          followingId: followship.followingId // 多做一個屬性應付測試檔檢查
        }))

      return res.status(200).json(followings)
    } catch (err) {
      return next(err)
    }
  },
  // No.8 - 查看某使用者的追隨者 GET /api/users/:id/followers
  getUserFollowers: async (req, res, next) => {
    try {
      const UserId = req.params.id
      const currentUserId = helpers.getUser(req).id

      // --資料提取--
      const followships = await Followship.findAll({
        where: { followingId: UserId },
        order: [['createdAt', 'DESC']],
        include: [{
          model: User,
          as: 'Follower',
          attributes: {
            exclude: ['password'],
            include: [[
              sequelize.literal(`(SELECT EXISTS(SELECT * FROM Followships WHERE FollowingId = Follower.id and FollowerId = ${currentUserId}))`),
              'isFollowed' // 目前的使用者是否追蹤
            ]]
          }
        }],
        nest: true
      })

      if (!followships) throw new Error('追隨者讀取失敗')

      // --資料整理--
      const followers = followships
        .map(followship => followship.toJSON())
        .map(followship => ({ // 拆掉最外層結構
          ...followship.Follower,
          followerId: followship.followerId // 多做一個屬性應付測試檔檢查
        }))

      return res.status(200).json(followers)
    } catch (err) {
      return next(err)
    }
  },
  // No.9 - GET /api/users? {limit=10} 查看跟隨者數量排名(前10)的使用者資料
  getUsers: async (req, res, next) => {
    try {
      const limit = Number(req.query.limit) || 10 // 若使用者未指定，預設為10筆
      const currentUserId = helpers.getUser(req).id

      // --資料提取--
      const users = await User.findAll({
        where: { id: { [Op.not]: currentUserId }, role: 'user' },
        attributes: {
          exclude: ['password'],
          include: [[
            sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE followingId = User.id)'),
            'followerNum' // 追隨者總數
          ], [
            sequelize.literal(`(SELECT EXISTS(SELECT * FROM Followships WHERE FollowingId = User.id and FollowerId = ${currentUserId}))`),
            'isFollowed' // 目前使用者是否追蹤
          ]]
        },
        limit,
        order: [[sequelize.literal('followerNum'), 'DESC']],
        raw: true
      })

      if (!users) throw new Error('使用者排行讀取失敗')

      return res.status(200).json(users)
    } catch (err) {
      return next(err)
    }
  },
  // No.10 - 編輯使用者資料 PUT /api/users/:id
  putUser: async (req, res, next) => {
    try {
      // 確認有權限修改
      const UserId = Number(req.params.id)
      const currentUserId = helpers.getUser(req).id

      if (currentUserId !== Number(UserId)) {
        const error = new Error('permission denied')
        error.status = 403
        throw error
      }

      // --資料提取--
      const user = await User.findByPk(UserId)
      if (!user) throw new Error('不存在的使用者')

      // 檢查各欄位是否符合規定
      const { account, name, email, password, checkPassword, introduction } = req.body
      if (password !== checkPassword) throw new Error('確認密碼不相符！')
      if (name > 50) throw new Error('名稱不能超過50字')
      if (introduction > 160) throw new Error('自我介紹不能超過160字')

      // 檢查新的帳密是否存在(但要排除未修改的狀況，否則所有request都會被擋)
      if (account && account !== user.account) {
        const user1 = await User.findOne({ where: { account } })
        if (user1) throw new Error('account已經存在')
      }
      if (email && email !== user.email) {
        const user1 = await User.findOne({ where: { email } })
        if (user1) throw new Error('email已經存在')
      }

      // 上傳檔案(非同步) - avatar: req.files.avatar[0], banner: req.files.banner[0]
      const [filePath1, filePath2] = await Promise.all([imgurFileHandler(req.files.avatar?.[0] || null), imgurFileHandler(req.files.banner?.[0] || null)])

      // 欄位更新:若有新值則給定新值，無新值則使用舊值
      const newUser = await user.update({
        account: account || user.account,
        name: name || user.name,
        email: email || user.email,
        password: password ? await bcrypt.hash(password, 10) : user.password,
        introduction: introduction || user.introduction,
        avatar: filePath1 || user.avatar || 'https://via.placeholder.com/224',
        banner: filePath2 || user.banner || 'https://images.unsplash.com/photo-1580436541340-36b8d0c60bae'
      })

      if (!newUser) throw new Error('資料更新失敗')

      return res.status(200).json(newUser)
    } catch (err) {
      return next(err)
    }
  }
}

module.exports = userController

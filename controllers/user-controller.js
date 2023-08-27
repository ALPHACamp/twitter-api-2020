const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')
const { User, Reply, Tweet, Like } = require('../models')
const { relativeTimeFromNow, formatDate, formatTime } = require('../helpers/dayjs-helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })// 簽發 JWT Token(期限30天)
      return res.status(200).json({
        token,
        user: userData
      })
    } catch (err) {
      return next(err)
    }
  },
  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      if (!name || !account || !email || !password || !checkPassword) throw new Error('所有欄位皆為必填！')
      if (name.length > 50) throw new Error('名稱字數超出上限！')
      if (password !== checkPassword) throw new Error('密碼與確認密碼不符合！')
      if (password.length < 5 || password.length > 20) throw new Error('請設定 5 到 20 位密碼')

      const [userEmail, userAccount] = await Promise.all([
        User.findOne({ where: { email } }),
        User.findOne({ where: { account } })
      ])
      if (userEmail) throw new Error('email已重複註冊！')
      if (userAccount) throw new Error('account已重複註冊！')

      const hash = await bcrypt.hash(password, 10)
      const newUser = await User.create({
        name,
        account,
        email,
        role: 'user',
        password: hash,
        avatar: 'htps://i.imgur.com/uSgVo9G.png',
        cover: 'https://i.imgur.com/7uwf8kO.png'
      })
      const userData = newUser.toJSON()
      delete userData.password
      return res.json({
        status: 'success',
        data: { user: userData }
      })
    } catch (err) {
      return next(err)
    }
  },
  getUser: async (req, res, next) => {
    try {
      const UserId = req.params.id // 被查看的使用者ID
      const isFollowed = helpers.getUser(req).Followings.some(f => f.id.toString() === UserId) || [] // 檢查用戶是否有被使用者追蹤
      const currentUserId = helpers.getUser(req).id.toString() // 用戶ID
      const isCurrentUser = currentUserId === UserId // 判斷是否是使用者本人
      const user = await User.findByPk(UserId, {
        attributes: { exclude: ['password'] },
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })
      if (!user || (user.role === 'admin')) {
        const err = new Error('使用者不存在！')
        err.status = 404
        throw err
      }
      const result = {
        ...user.toJSON(),
        followersCount: user.Followers.length,
        followingsCount: user.Followings.length,
        isCurrentUser,
        isFollowed
      }
      delete result.Followers
      delete result.Followings
      return res.json(result)
    } catch (err) {
      next(err)
    }
  },
  editUser: async (req, res, next) => {
    try {
      const UserId = req.params.id // 被查看的使用者 ID
      const currentUserId = helpers.getUser(req).id.toString() // 用戶 ID
      const isCurrentUser = currentUserId === UserId // 判斷是否是使用者本人
      if (!isCurrentUser) throw new Error('使用者非本人！')

      const user = await User.findByPk(UserId, {
        attributes: { exclude: ['password'] }
      })
      if (!user || user.role === 'admin') {
        const err = new Error('使用者不存在！')
        err.status = 404
        throw err
      }

      const { account, name, email, password, checkPassword, introduction } = req.body // 拿取前端回傳資料
      const avatarPath = req.files?.avatar ? await imgurFileHandler(req.files.avatar[0]) : null
      const coverPath = req.files?.cover ? await imgurFileHandler(req.files.cover[0]) : null

      if (account && name && email && password && checkPassword) { // EDIT
        if (name.length > 50) throw new Error('名稱字數超出上限！')
        if (password !== checkPassword) throw new Error('密碼與確認密碼不符合！')
        if (introduction.length > 160) throw new Error('自我介紹字數超出上限！')

        const [userEmail, userAccount] = await Promise.all([
          User.findOne({ where: { email } }),
          User.findOne({ where: { account } })
        ])

        if (userEmail && userEmail.id !== currentUserId) throw new Error('email已重複註冊！') // 除了自己以外的 email
        if (userAccount && userAccount.id !== currentUserId) throw new Error('account已重複註冊！') // 除了自己以外的 account

        const hash = await bcrypt.hash(password, 10)
        await User.update(
          {
            name,
            account,
            email,
            password: hash
          },
          { where: { id: UserId } }
        )
      } else if (name && (introduction || avatarPath || coverPath)) { // SETTING
        // Setting 回傳值(須包含 name + 其他至少一項)
        await User.update({
          name,
          introduction,
          avatar: avatarPath || null,
          cover: coverPath || null
        },
        { where: { id: UserId } }
        )
      } else {
        throw new Error('必填欄位需填上！')
      }

      // 更新後的用戶資料
      const updatedUser = await User.findByPk(UserId, {
        attributes: { exclude: ['password'] }
      })
      return res.json({
        status: 'success',
        message: account ? 'Edit成功' : 'Setting成功',
        data: { user: updatedUser.toJSON() }
      })
    } catch (err) {
      next(err)
    }
  },
  getUserTweets: async (req, res, next) => {
    try {
      const userId = req.params.id // 被查看的使用者 ID
      const user = await User.findByPk(userId)
      // 取tw
      const tweets = await Tweet.findAll({
        where: { UserId: user.id },
        include: [
          {
            model: User,
            attributes: { exclude: ['password'] }
          },
          { model: Reply },
          {
            model: User,
            as: 'LikedUsers'
          }
        ],
        order: [['createdAt', 'DESC']]
      })

      if (!user || (user.role === 'admin')) {
        const err = new Error('使用者不存在！')
        err.status = 404
        throw err
      }
      if (!tweets) throw new Error('目前沒有任何推文。')
      const isLiked = tweets.LikedUsers?.some(liked => liked.UserId === helpers.getUser(req).id) || false
      // const likedTweetsId = helpers.getUser(req)?.Likes ? helpers.getUser(req).Likes.map(l => l.TweetId) : []
      const data = tweets.map(tweet => ({
        ...tweet.toJSON(),
        createdAt: relativeTimeFromNow(tweet.createdAt),
        repliedAmount: tweet.Replies.length || 0,
        likedAmount: tweet.LikedUsers.length || 0,
        isLiked
      }))
      return res.json(data)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController

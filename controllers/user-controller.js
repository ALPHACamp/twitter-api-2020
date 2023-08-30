const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')
const { User, Reply, Tweet, Like, Followship } = require('../models')
const { relativeTimeFromNow } = require('../helpers/dayjs-helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')
const sequelize = require('sequelize')

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
      if (!/^[a-zA-Z0-9]+$/.test(account)) throw new Error('帳號只能包含英文字母和數字！')
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
        avatar: 'https://i.imgur.com/uSgVo9G.png',
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

      if (account && name && email && password && checkPassword) { // Setting
        if (!/^[a-zA-Z0-9]+$/.test(account)) throw new Error('帳號只能包含英文字母和數字！')
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
      } else if (name && (introduction || avatarPath || coverPath)) { // Edit
        if (name.length > 50) throw new Error('名稱字數超出上限！')
        if (introduction.length > 160) throw new Error('自我介紹字數超出上限！')
        // Setting 回傳值(須包含 name + 其他至少一項)
        await User.update({
          name,
          introduction,
          avatar: avatarPath || 'https://i.imgur.com/uSgVo9G.png',
          cover: coverPath || 'https://i.imgur.com/7uwf8kO.png'
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
        message: account ? 'Setting成功' : 'Edit成功',
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
      // 取tweets及其關聯
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
      if (!tweets.length) {
        return res.status(200).json({
          status: 'success',
          message: '使用者無推文!'
        })
      }
      const data = tweets.map(tweet => ({
        ...tweet.toJSON(),
        createdAt: relativeTimeFromNow(tweet.createdAt),
        repliedAmount: tweet.Replies.length || 0,
        likedAmount: tweet.LikedUsers.length || 0,
        isLiked: tweets.LikedUsers?.some(liked => liked.UserId === helpers.getUser(req).id) || false
      }))
      return res.json(data)
    } catch (err) {
      next(err)
    }
  },
  getUserReplies: async (req, res, next) => {
    try {
      const userId = req.params.id // 被查看的使用者 ID
      const user = await User.findByPk(userId)

      if (!user || (user.role === 'admin')) {
        const err = new Error('使用者不存在！')
        err.status = 404
        throw err
      }
      // 取replies及其關聯
      const replies = await Reply.findAll({
        where: { UserId: user.id },
        include: [
          {
            model: User,
            attributes: { exclude: ['password'] }// 回傳 User本人
          },
          {
            model: Tweet, include: [{ model: User, attributes: ['id', 'account'] }]// 回傳這篇推文主人的id、account
          }
        ],
        order: [['createdAt', 'DESC']]
      })

      if (!replies.length) {
        return res.status(200).json({
          status: 'success',
          message: '使用者無回覆!'
        })
      }
      const data = replies.map(reply => ({
        ...reply.toJSON(),
        createdAt: relativeTimeFromNow(reply.createdAt)
      }))
      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  getUserLikes: async (req, res, next) => {
    try {
      const userId = req.params.id // 被查看的使用者 ID
      const currentUserId = helpers.getUser(req).id // 當前使用者 ID
      const user = await User.findByPk(userId)

      if (!user || (user.role === 'admin')) {
        const err = new Error('使用者不存在！')
        err.status = 404
        throw err
      }
      // 取Likes及其關聯
      const [likes, myLikes] = await Promise.all([
        Like.findAll({
          where: { UserId: user.id },
          include: [
            {
              model: Tweet, include: [{ model: User, attributes: ['id', 'account'] }, Reply, Like]// 回傳這篇推文主人的id、account、及回覆數
            }
          ],
          order: [['createdAt', 'DESC']]
        }),
        // 當前使用者的喜愛清單
        Like.findAll({
          where: { UserId: currentUserId },
          raw: true
        })
      ])

      if (!likes.length) {
        return res.status(200).json({
          status: 'success',
          message: '使用者無喜愛推文!'
        })
      }
      const currentUserLikes = myLikes.map(l => l.TweetId) || [] // 當前使用者的喜愛推文清單 ID陣列
      const data = likes.map(like => ({
        ...like.toJSON(),
        createdAt: relativeTimeFromNow(like.createdAt),
        repliedAmount: like.Tweet.Replies.length || 0,
        likedAmount: like.Tweet.Likes.length || 0,
        isLiked: currentUserLikes?.includes(like.Tweet.id)
      }))
      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  getUserFollowings: async (req, res, next) => {
    try {
      const userId = req.params.id // 被查看的使用者 ID
      const currentUserId = helpers.getUser(req).id
      // 取User(引入Followings)
      const [user, followings] = await Promise.all([
        User.findByPk(userId, {
          include: {
            model: User,
            as: 'Followings'
          },
          order: [[sequelize.literal('`Followings->Followship`.`createdAt`'), 'DESC']]
        }),
        // 目前登入者的追蹤資料
        Followship.findAll({
          where: { followerId: currentUserId },
          raw: true
        })
      ])
      if (!user || (user.role === 'admin')) {
        const err = new Error('使用者不存在！')
        err.status = 404
        throw err
      }
      if (!user.Followings.length) {
        return res.status(200).json({
          status: 'success',
          message: '使用者無追隨中的用戶!'
        })
      }
      const currentUserFollowing = followings.map(f => f.followingId) // 使用者本人追蹤的名單陣列(裡面含追蹤者id)
      const data = user.Followings.map(u => ({
        followingId: u.id,
        account: u.account,
        name: u.name,
        avatar: u.avatar,
        introduction: u.introduction,
        isFollowed: currentUserFollowing?.includes(u.id)
      }))
      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  getUserFollowers: async (req, res, next) => {
    try {
      const userId = req.params.id // 被查看的使用者 ID
      const currentUserId = helpers.getUser(req).id
      // 取User(引入Followers)
      const [user, followings] = await Promise.all([
        User.findByPk(userId, {
          include: {
            model: User,
            as: 'Followers'
          },
          order: [[sequelize.literal('`Followers->Followship`.`createdAt`'), 'DESC']]
        }),
        // 目前登入者的追蹤資料
        Followship.findAll({
          where: { followerId: currentUserId },
          raw: true
        })
      ])
      if (!user || (user.role === 'admin')) {
        const err = new Error('使用者不存在！')
        err.status = 404
        throw err
      }
      if (!user.Followers.length) {
        return res.status(200).json({
          status: 'success',
          message: '使用者無追隨者!'
        })
      }
      const currentUserFollowing = followings.map(f => f.followingId) // 使用者本人追蹤的名單陣列(裡面含追蹤者id)
      const data = user.Followers.map(u => ({
        followerId: u.id,
        account: u.account,
        name: u.name,
        avatar: u.avatar,
        introduction: u.introduction,
        isFollowed: currentUserFollowing?.includes(u.id)
      }))
      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  getTopUsers: async (req, res, next) => {
    try {
      const topNumber = Number(req.query.top)
      const currentUser = helpers.getUser(req).id // 目前登入者的id
      const followings = helpers.getUser(req).Followings // 目前登入者的追蹤資料
      const currentUserFollowing = followings.map(f => f.followingId) // 使用者本人追蹤的名單陣列(裡面含追蹤者id)
      // 取User(引入Followers)
      const users = await User.findAll({
        where: {
          id: { [sequelize.Op.ne]: currentUser }, role: 'user'// 比對userid非本人 且role為user
        },
        attributes: { exclude: 'password' },
        include: { model: User, as: 'Followers' }
      })
      if (!users) {
        const err = new Error('不存在使用者')
        err.status = 404
        throw err
      }
      const data = users
        .map(user => ({
          id: user.id,
          account: user.account,
          name: user.name,
          avatar: user.avatar,
          followerCount: user.Followers?.length || 0,
          isFollowed: currentUserFollowing?.includes(user.id) || false
        }))
        .sort((a, b) => b.followerCount - a.followerCount)
        .slice(0, topNumber)
      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  }

}

module.exports = userController

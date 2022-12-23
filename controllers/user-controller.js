const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User, Tweet, Followship, Reply, sequelize, Like } = require('../models')
const helpers = require('../_helpers')

const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      if (userData.role !== 'user') {
        res.status(404).json({ status: 'error', message: '帳號不存在!' })
      }
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
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

  signUp: async (req, res, next) => {
    try {
      const message = {}
      const { account, name, email, password, checkPassword } = req.body
      if (password !== checkPassword) res.status(422).json({ status: 'error', message: '密碼與確認密碼不一致!' })
      // 查詢資料庫帳號與信箱是否已註冊
      const [userAccount, userEmail] = await Promise.all([
        User.findOne({ where: { account } }),
        User.findOne({ where: { email } })
      ])
      if (userAccount) message.account = 'account 已重複註冊！'
      if (userEmail) message.email = 'email 已重複註冊！'

      // 若有任一錯誤，回傳錯誤訊息及原填載資料
      if (Object.keys(message).length !== 0) {
        return res.status(400).json({
          status: 'error',
          message,
          account,
          name,
          email
        })
      }
      // 建立新使用者
      const createdUser = await User.create({
        account,
        name,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
        role: 'user',
        avatar: 'https://i.imgur.com/zC0XOiB.png',
        cover: 'https://i.imgur.com/D6f1MZe.png'
      })
      // 回傳新使用者資料，刪除password欄位
      const user = createdUser.toJSON()
      delete user.password
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'success',
        data: {
          token,
          user
        }
      })
    } catch (err) {
      next(err)
    }
  },

  getUser: (req, res, next) => {
    const id = Number(req.params.id)
    const currentUser = helpers.getUser(req)
    return User.findByPk(id, {
      where: { role: 'user' },
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt'],
        include: [
          [sequelize.literal('(SELECT COUNT(id) FROM Followships WHERE Followships.following_id = User.id)'), 'followerCount'],
          [sequelize.literal('(SELECT COUNT(id) FROM Followships WHERE Followships.follower_id = User.id)'), 'followingCount'],
          [sequelize.literal('(SELECT COUNT(id)  FROM Tweets WHERE Tweets.User_id = User.id)'), 'tweetCount'],
          [sequelize.literal(`EXISTS (SELECT id FROM Followships WHERE Followships.follower_id = ${currentUser.id} AND Followships.following_id = User.id )`), 'isFollowed']
        ]
      }
    })
      .then(user => {
        if (!user) res.status(404).json({ status: 'error', message: '帳號不存在!' })
        const { ...userData } = {
          ...user.toJSON()
        }
        return res.status(200).json({ ...userData })
      })
      .catch(err => next(err))
  },

  putUserSetting: (req, res, next) => {
    const currentUser = helpers.getUser(req)
    const { password, checkPassword, email, account, name } = req.body
    if (!password || !checkPassword || !email || !account || !name) return res.status(422).json({ status: 'error', message: '所有欄位不得空白!' })

    if (Number(req.params.id) !== currentUser.id) return res.status(401).json({ status: 'error', message: '無權編輯他人資料!' })

    // 確認密碼是否變更
    if (password && password !== checkPassword) return res.status(422).json({ status: 'error', message: '密碼與確認密碼不一致!' })

    return Promise.all([
      User.findByPk(currentUser.id),
      User.findOne({ where: { account }, raw: true }),
      User.findOne({ where: { email }, raw: true })
    ])
      .then(([user, duplicateAccount, duplicateEmail]) => {
        if (!user) res.status(404).json({ status: 'error', message: '帳號不存在!' })
        if (duplicateAccount && duplicateAccount.id !== currentUser.id) return res.status(422).json({ status: 'error', message: 'account 已重複註冊！' })
        if (duplicateEmail && duplicateEmail.id !== currentUser.id) return res.status(422).json({ status: 'error', message: 'email 已重複註冊！' })
        return user.update({
          email: email || user.email,
          password: password ? bcrypt.hashSync(password, bcrypt.genSaltSync(10), null) : user.password,
          account: account || user.account
        })
      })
      .then(updatedUser => {
        updatedUser.toJSON()
        delete updatedUser.password
        delete updatedUser.role
        res.status(200).json({ status: 'success', message: '使用者資料更新成功!', updatedUser })
      })
      .catch(err => next(err))
  },

  putUserProfile: (req, res, next) => {
    const currentUser = helpers.getUser(req)
    const { name, introduction } = req.body
    const { files } = req

    if (Number(req.params.id) !== currentUser.id) return res.status(401).json({ status: 'error', message: '無權編輯他人資料!' })
    if (!name) return res.status(422).json({ status: 'error', message: '暱稱為必填!' })
    if (name.length > 50) return res.status(422).json({ status: 'error', message: '暱稱不得超過50字!' })
    if (introduction && introduction.length > 160) return res.status(422).json({ status: 'error', message: '自我介紹不得超過160字!' })

    // 確認是否有圖片
    const avatar = files?.avatar ? files.avatar[0] : null
    const cover = files?.cover ? files.cover[0] : null

    return Promise.all([
      User.findByPk(currentUser.id),
      helpers.imgurFileHandler(avatar),
      helpers.imgurFileHandler(cover)
    ])
      .then(([user, avatarPath, coverPath]) => {
        if (!user) res.status(404).json({ status: 'error', message: '帳號不存在!' })
        return user.update({
          name,
          introduction: introduction || '',
          avatar: avatarPath || user.avatar,
          cover: coverPath || user.cover
        })
      })
      .then(updatedUser => {
        updatedUser.toJSON()
        delete updatedUser.password
        delete updatedUser.role
        res.status(200).json({ status: 'success', message: '使用者個人資料更新成功!', updatedUser })
      })
      .catch(err => next(err))
  },

  getUserTweets: (req, res, next) => {
    const { id } = req.params
    const currentUser = helpers.getUser(req)
    return Promise.all([
      User.findByPk(id),
      Tweet.findAll({
        where: { UserId: id },
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true,
        attributes: [
          'id', 'UserId', 'description', 'createdAt',
          [sequelize.literal('(SELECT COUNT(id) FROM Likes WHERE Likes.Tweet_id = Tweet.id)'), 'likeCount'],
          [sequelize.literal('(SELECT COUNT(id) FROM Replies WHERE Replies.Tweet_id = Tweet.id)'), 'replyCount']
        ]
      })
    ])
      .then(([user, tweets]) => {
        if (!user) res.status(404).json({ status: 'error', message: '帳號不存在!' })
        if (!tweets) res.status(404).json({ status: 'error', message: '貼文不存在!' })
        const data = tweets.map(t => ({
          ...t,
          createdAt: helpers.relativeTime(t.createdAt),
          isLiked: currentUser?.Likes?.some(currentUserLike => currentUserLike?.TweetId === t.id)
        }))
        res.status(200).json(data)
      })
      .catch(err => next(err))
  },

  getUserFollowings: (req, res, next) => {
    const { id } = req.params
    const currentUser = helpers.getUser(req)
    return Promise.all([
      User.findByPk(id),
      Followship.findAll({
        attributes: { exclude: 'updatedAt' },
        order: [['createdAt', 'DESC']],
        include: {
          model: User,
          as: 'FollowingUser',
          attributes: ['id', 'account', 'name', 'avatar', 'introduction',
            [sequelize.literal(`EXISTS(SELECT true FROM Followships WHERE Followships.follower_id = ${currentUser.id} AND Followships.following_id = Followship.following_id)`), 'isFollowed']
          ]
        },
        where: { followerId: id },
        raw: true,
        nest: true
      })
    ])
      .then(([user, followings]) => {
        if (!user) res.status(404).json({ status: 'error', message: '帳號不存在!' })
        const data = followings.map(fi => ({
          ...fi,
          createdAt: helpers.relativeTime(fi.createdAt)
          // isFollowed: currentUser?.Followers?.some(currentUserFollow => currentUserFollow?.followerId === fi.id)
        }))
        res.status(200).json(data)
      })
      .catch(err => next(err))
  },

  getUserFollowers: (req, res, next) => {
    const { id } = req.params
    const currentUser = helpers.getUser(req)
    return Promise.all([
      User.findByPk(id),
      Followship.findAll({
        attributes: { exclude: 'updatedAt' },
        order: [['createdAt', 'DESC']],
        include: {
          model: User,
          as: 'FollowerUser',
          attributes: ['id', 'account', 'name', 'avatar', 'introduction',
            [sequelize.literal(`EXISTS(SELECT true FROM Followships WHERE Followships.follower_id = ${currentUser.id} AND Followships.following_id = Followship.follower_id)`), 'isFollowed']
          ]
        },
        where: { followingId: id },
        raw: true,
        nest: true
      })
    ])
      .then(([user, followers]) => {
        if (!user) res.status(404).json({ status: 'error', message: '帳號不存在!' })
        const data = followers.map(fl => ({
          ...fl,
          createdAt: helpers.relativeTime(fl.createdAt)
          // isFollowed: currentUser?.Followers?.some(currentUserFollow => currentUserFollow?.followerId === fl.id)
        }))
        console.log(currentUser.Followings)
        res.status(200).json(data)
      })
      .catch(err => next(err))
  },

  getLikes: (req, res, next) => {
    const UserId = req.params.id
    const currentUser = helpers.getUser(req).id
    return Promise.all([User.findByPk(UserId), Like.findAll({
      where: { UserId },
      include: {
        model: Tweet,
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
        ],
        attributes: ['id', 'description', 'createdAt',
          [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.tweet_id = Tweet.id)'), 'likeCount'],
          [sequelize.literal('(SELECT COUNT(*)  FROM Replies WHERE Replies.tweet_id = Tweet.id)'),
            'replyCount'],
          [sequelize.literal(`EXISTS (SELECT id FROM Likes WHERE Likes.user_id = ${currentUser} AND Likes.tweet_id = Tweet.id)`), 'isLiked']
        ]
      },
      order: [['createdAt', 'Desc']],
      raw: true,
      nest: true
    })])
      .then(([user, likes]) => {
        if (!user) return res.status(404).json({ status: 'error', message: '帳號不存在!' })
        const likeData = likes.map(li => ({
          ...li,
          createdAt: helpers.relativeTime(li.createdAt),
          isLiked: Boolean(li.Tweet.isLiked)
        }))
        return res.status(200).json(likeData)
      })
      .catch(err => next(err))
  },

  getUserReplies: (req, res, next) => {
    const id = Number(req.params.id)
    return Promise.all([
      User.findByPk(id),
      Reply.findAll({
        where: { UserId: id },
        include: [
          { model: User, attributes: ['id', 'account', 'name', 'avatar'] },
          {
            model: Tweet,
            attributes: ['UserId'],
            include: {
              model: User,
              attributes: ['account', 'id']
            }
          }
        ],
        attributes: { exclude: ['updatedAt'] },
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })
    ])
      .then(([user, replies]) => {
        if (!user) res.status(404).json({ status: 'error', message: '帳號不存在!' })
        if (replies.length === 0) return res.status(404).json({ status: 'error', message: '使用者沒有回覆任何一則留言!' })
        const data = replies.map(rp => ({
          ...rp,
          createdAt: helpers.relativeTime(rp.createdAt)
        }))
        return res.status(200).json(data)
      })
      .catch(err => next(err))
  }
}
module.exports = userController

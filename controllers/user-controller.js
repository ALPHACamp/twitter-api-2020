const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { User, Tweet, sequelize } = require('../models')
const helpers = require('../_helpers')
const { imgurFileHandler } = require('../helpers/file-helper')
const { relativeTime } = require('../helpers/date-helper')

const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      if (userData.role !== 'user') {
        throw new Error('帳號不存在')
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
      const { account, name, email, password, checkPassword } = req.body
      // 初始化message物件
      const message = {}
      if (password !== checkPassword) return res.status({ status: 'error', message: '密碼與確認密碼不一致' })
      // 查詢資料庫帳號與信箱是否已註冊
      const [userAccount, userEmail] = await Promise.all([
        User.findOne({ where: { account } }),
        User.findOne({ where: { email } })
      ])

      if (userAccount) message.account = '帳號已註冊!'
      if (userEmail) message.email = '信箱已註冊!'

      // 若有任一錯誤，接回傳錯誤訊息及原填載資料
      if (Object.keys(message).length !== 0) {
        return res.status(422).json({
          status: 'error',
          message,
          account,
          name,
          email
        })
      }

      // 建立新使用者
      const newUser = await User.create({
        account,
        name,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
        role: 'user',
        cover: 'https://loremflickr.com/1500/800/mountain'
      })

      // 回傳新使用者資料，刪除password欄位
      const userData = newUser.toJSON()
      delete userData.password
      return res.json({
        status: 'success',
        user: userData
      })
    } catch (err) {
      next(err)
    }
  },
  getUser: (req, res, next) => {
    const id = Number(req.params.id)
    return User.findByPk(id, {
      // include: [
      // Tweet,
      //  { model: User, as: 'Followers' },
      //  { model: User, as: 'Followings' }
      // ],
      where: { id, role: 'user' },
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt'],
        include: [
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.following_id = User.id)'), 'followerCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.follower_id = User.id)'), 'followingCount']
        ]
      }
    })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        if (user.role === 'admin') throw new Error('帳號不存在！')
        const { ...userData } = {
          ...user.toJSON()
        }
        return res.json({ ...userData })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { name, email, password, checkPassword, account, introduction } = req.body
    const currentUser = helpers.getUser(req)
    const { files } = req

    if (Number(req.params.id) !== currentUser.id) res.status(401).json({ status: 'error', message: '無權限編輯他人個人資料' })
    if (!name) throw new Error('使用者姓名為必填!')
    if (name.length > 50) throw new Error('使用者姓名不得超過50字!')

    // email不可重複
    if (email !== currentUser.email) {
      User.findOne({ where: { email } })
        .then(duplicateEmail => {
          if (duplicateEmail) throw new Error('email已註冊!')
        })
    }
    // account不可重複
    if (account !== currentUser.account) {
      User.findOne({ where: { account } })
        .then(duplicateAccount => {
          if (duplicateAccount) throw new Error('account已註冊!')
        })
    }

    // 確認密碼是否變更
    if (password && password !== checkPassword) return res.json({ status: 'error', message: '密碼與確認密碼不一致' })

    // 確認是否有圖片
    const avatar = files?.avatar ? files.avatar[0] : null
    const cover = files?.cover ? files.cover[0] : null

    return Promise.all([
      User.findByPk(currentUser.id),
      imgurFileHandler(avatar),
      imgurFileHandler(cover)
    ])
      .then(([user, avatarPath, coverPath]) => {
        if (!user) throw new Error('查無使用者!')
        return user.update({
          name,
          email: email || user.email,
          password: password ? bcrypt.hashSync(password, bcrypt.genSaltSync(10), null) : user.password,
          account: account || user.account,
          introduction: introduction || null,
          avatar: avatarPath || user.avatar,
          cover: coverPath || user.cover
        })
      })
      .then(updatedUser => {
        updatedUser.toJSON()
        delete updatedUser.password
        delete updatedUser.role
        res.status(200).json({ status: 'success', message: '使用者資料更新成功!', data: updatedUser })
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
          'id',
          'UserId',
          'description',
          'createdAt',
          [sequelize.literal('(SELECT COUNT(id) FROM Likes WHERE Likes.Tweet_id = Tweet.id)'), 'likeCount'],
          [sequelize.literal('(SELECT COUNT(id) FROM Replies WHERE Replies.Tweet_id = Tweet.id)'), 'replyCount']
        ]
      })
    ])
      .then(([user, tweets]) => {
        if (!user) throw new Error('查無使用者!')
        if (!tweets) throw new Error('貼文不存在!')
        const data = tweets.map(t => ({
          ...t,
          createdAt: relativeTime(t.createdAt),
          isLiked: currentUser?.Likes?.some(currentUserLike => currentUserLike?.TweetId === t.id)
        }))
        res.status(200).json(data)
      })
      .catch(err => next(err))
  }
}
module.exports = userController

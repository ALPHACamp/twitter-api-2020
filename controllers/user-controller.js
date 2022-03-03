const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User, Tweet, Reply, Like, sequelize } = require('../models')
const helpers = require('../_helpers')
const Op = require('../models').Sequelize.Op
const { imgurFileHandler } = require('../helpers/file-helper')

const userController = {

  signUp: (req, res, next) => {
    const {
      account,
      name,
      email,
      password,
      checkPassword
    } = req.body
    if (password !== checkPassword) throw new Error('密碼兩次輸入不同')
    // console.log(email + name)
    return Promise.all([
      User.findOne({ where: { email: req.body.email } }),
      User.findOne({ where: { account: req.body.account } })])
      .then(([email, account]) => {
        if (email) throw new Error('email 已重複註冊！')
        if (account) throw new Error('account 已重複註冊！')
        return bcrypt.hash(password, 10)
      })
      .then(hash => {
        return User.create({ account, password: hash, name, email })
      })
      .then(registerUser => {
        const user = registerUser.toJSON()
        delete user.password
        return res.status(200).json(user)
      })
      .catch(err => next(err))
  },
  signIn: (req, res, next) => {
    const { account, password } = req.body

    if (!account || !password) { throw new Error('所有欄位都要填寫') }
    return User.findOne({ where: { account } })
      .then(user => {
        if (!user) { throw new Error('帳號不存在!') }
        if (user.role === 'admin') throw new Error('帳號不存在！')
        return Promise.all([bcrypt.compare(password, user.password), user])
      })
      .then(([isMatched, user]) => {
        if (!isMatched) { throw new Error('密碼錯誤') }
        const userData = user.toJSON()
        delete userData.password
        const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
        return res.json({ status: 'success', token, user: userData })
      })
      .catch(error => next(error))
  },
  getUser: (req, res, next) => {
    const userId = Number(req.params.id)
    User.findByPk(userId)
      .then(user => {
        if (!user) throw new Error('帳號不存在')
        // if (user.role === 'admin') throw new Error('帳號不存在！')
        return res.status(200).json(user)
      })
      .catch(err => next(err))
  },
  putUser: async (req, res, next) => {
    try {
      const targetUserId = Number(req.params.id)
      const currentUserId = helpers.getUser(req).id
      const user = await User.findByPk(targetUserId)
      const { name, introduction, cover, avatar } = req.body
      const { files } = req
      console.log(cover)
      console.log(avatar)

      if (targetUserId !== currentUserId) {
        return res.status(400).json({
          status: 'error',
          message: '使用者只能修改自己的資料'
        })
      }
      let uploadAvatar = ''
      let uploadCover = ''
      uploadAvatar = files && files.cover
        ? await imgurFileHandler(files.cover[0])
        : user.cover
      uploadCover = files && files.cover
        ? await imgurFileHandler(files.cover[0])
        : user.cover

      await user.update({
        name,
        introduction,
        avatar: uploadAvatar,
        cover: uploadCover
      })

      const results = {
        account: user.account,
        name,
        introduction,
        avatar: uploadAvatar,
        cover: uploadCover
      }

      return res.status(200).json({
        status: 'success',
        data: results,
        message: '修改成功'
      })
    } catch (err) { next(err) }
  },
  putUserSettings: async (req, res, next) => {
    try {
      const { name, account, email, password, checkPassword } = req.body
      const currentUserId = helpers.getUser(req).id
      const targetUserId = Number(req.params.id)
      const errorMsg = []
      if (currentUserId !== targetUserId) {
        return res.status(400).json({
          status: 'error',
          message: '只能更新自己的資料'
        })
      }

      // 判斷Account、Email 是唯一
      const [isExistAccount, isExistEmail] = await Promise.all([
        User.findOne({ attributes: ['id', 'account'], where: { account } }),
        User.findOne({ attributes: ['id', 'email'], where: { email } })
      ])
      if (isExistAccount && isExistAccount.id !== currentUserId) errorMsg.push('此 account 已被註冊')
      if (isExistEmail && isExistEmail.id !== currentUserId) errorMsg.push('此 email 已被註冊')
      if (password !== checkPassword) errorMsg.push('密碼與確認密碼不相符！')
      if (errorMsg.length !== 0) {
        return res.status(400).json({
          status: 'error',
          message: errorMsg[0]
        })
      }
      await User.update({
        name,
        account,
        email,
        password: bcrypt.hashSync(password, 10)
      }, { where: { id: targetUserId } })
      const result = { name, account, email }
      return res.status(200).json({
        status: 'success',
        message: '資料修改成功',
        data: result
      })
    } catch (err) { next(err) }
  },
  getUserTweets: async (req, res, next) => {
    const userId = Number(req.params.id)
    return Promise.all([
      User.findByPk(userId),
      Tweet.findAll({
        where: { userId: userId },
        include: [{
          model: User,
          attributes: ['id', 'name', 'account', 'avatar']
        }],
        order: [['createdAt', 'DESC']]
      })
    ])
      .then(([user, tweets]) => {
        if (!user) throw new Error('帳號不存在！')
        if (!tweets) throw new Error('使用者沒有任何推文!')
        return res.status(200).json(tweets)
      })

      .catch(err => next(err))
  },
  getRepliedTweets: (req, res, next) => {
    const userId = Number(req.params.id)
    return Promise.all([
      User.findByPk(userId),
      Reply.findAll({
        where: { UserId: userId },
        attributes: ['id', 'comment', 'createdAt', 'tweetId'],
        include: [{
          model: Tweet,
          attributes: ['id', 'description', 'createdAt', 'replyCount', 'likeCount'],
          include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }
          ]
        }]
      })
    ])
      .then(([user, replies]) => {
        if (!user) { throw new Error('帳號不存在!') }
        if (!replies) throw new Error('使用者沒有回覆任何推文!')
        return res.status(200).json(replies)
      })
      .catch(err => next(err))
  },
  getLikes: (req, res, next) => {
    const userId = Number(req.params.id)
    return Promise.all([
      User.findByPk(userId),
      Like.findAll({
        where: { UserId: userId },
        attributes: ['id', 'createdAt', 'TweetId'],
        order: [['createdAt', 'DESC']],
        include: [{
          model: Tweet,
          attributes: ['id', 'description', 'createdAt', 'replyCount', 'likeCount'],
          include: [{
            model: User,
            attributes: ['id', 'name', 'account', 'avatar']
          }]
        }]
      })
    ])
      .then(([user, likes]) => {
        if (!user) throw new Error('帳號不存在!')
        if (likes.length === 0) throw new Error('使用者並未喜歡任何推文!')
        const userLikes = likes.map(like => ({ ...like.toJSON(), isLiked: true }))
        return res.status(200).json(userLikes)
      })
      .catch(err => next(err))
  },
  getUserFollowings: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const targetUserId = req.params.id
      const role = (await User.findByPk(targetUserId)).dataValues.role
      if (!targetUserId || role === 'admin') {
        return res.status(404).json({
          status: 'error',
          message: '使用者不存在'
        })
      }
      const findOption = {
        include: [
          {
            model: User,
            as: 'Followings',
            attributes: [
              ['id', 'followingId'],
              'name', 'account', 'introduction',
              'cover', 'avatar',
              [
                sequelize.literal(`
                  EXISTS (
                      SELECT 1 FROM Followships
                      WHERE followerId = ${currentUserId} 
                      AND followingId = Followings.id
                    )
                `),
                'isFollowed'
              ]
            ]
          }
        ],
        attributes: [],
        order: [
          [sequelize.literal('`Followings->Followship`.`createdAt`'), 'DESC']
        ]
      }
      const followerUsers = await User.findByPk(targetUserId, findOption)

      const result = followerUsers.toJSON().Followings

      result.forEach(fu => {
        fu.isFollowed = Boolean(fu.isFollowed)
      })

      return res
        .status(200)
        .json(result)
    } catch (err) { next(err) }
  },
  getUserFollowers: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const targetUserId = req.params.id
      const role = (await User.findByPk(targetUserId)).dataValues.role
      if (!targetUserId || role === 'admin') {
        return res.status(404).json({
          status: 'error',
          message: '使用者不存在'
        })
      }
      const findOption = {
        include: [
          {
            model: User,
            as: 'Followers',
            attributes: [
              ['id', 'followerId'],
              'name', 'account', 'introduction',
              'cover', 'avatar',
              [
                sequelize.literal(`
                  EXISTS (
                      SELECT 1 FROM Followships
                      WHERE followerId = ${currentUserId} 
                      AND followingId = Followers.id
                    )
                `),
                'isFollowed'
              ]
            ]
          }
        ],
        attributes: [],
        order: [
          [sequelize.literal('`Followers->Followship`.`createdAt`'), 'DESC']
        ]
      }
      const followerUsers = await User.findByPk(targetUserId, findOption)

      const result = followerUsers.toJSON().Followers

      result.forEach(fu => {
        fu.isFollowed = Boolean(fu.isFollowed)
      })

      return res
        .status(200)
        .json(result)
    } catch (err) { next(err) }
  },
  getTopUsers: async (req, res, next) => {
    try {
      const user = helpers.getUser(req)
      const users = await User.findAll({
        where: {
          id: {
            [Op.ne]: user.id
          },
          role: 'user'
        },
        include: [{ model: User, as: 'Followers', attributes: { exclude: ['password'] } }],
        attributes: [
          'id',
          'name',
          'avatar',
          'account',
          'followerCount'
        ],
        order: [[sequelize.literal('followerCount'), 'DESC']],
        limit: 10
      })

      const followedUsers = helpers.getUser(req).Followings

      const results = users.map(u => ({
        ...u.toJSON(),
        isFollowed: followedUsers.some(fu => fu.id === u.id)
      }))

      return res.json({ status: 'success', message: '成功獲取', data: results })
    } catch (err) {
      next(err)
    }
  },
  getCurrentUser: async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id

      const currentUser = await User.findByPk(userId, {
        attributes: [
          'id',
          'account',
          'email',
          'name',
          'avatar',
          'role',
          'cover',
          'followerCount',
          'followingCount',
          'tweetCount'
        ]
      })
      return res.json({ status: 'success', message: '成功獲取當下登入的使用者', data: currentUser })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController

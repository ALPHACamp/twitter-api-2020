const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { User, Tweet, Like, Reply, Followship } = require('../models')
const { Op } = require('sequelize')
const { imgurFileHandler } = require('../helpers/file-handler')
const helpers = require('../_helpers')

const userController = {
  signUp: (req, res, next) => {
    const { name, account, email, password, checkPassword } = req.body
    if (!name || !account || !email || !password || !checkPassword) throw new Error('所有欄位皆為必填！')
    if (name.length > 50) throw new Error('暱稱字數超出上限！')
    if (account.length > 30) throw new Error('帳號字數超出上限！')
    if (password.length < 5 || password.length > 20) throw new Error('請設定 5 到 20 字的密碼！')
    if (password !== checkPassword) throw new Error('密碼與確認密碼不符合！')

    return Promise.all([
      User.findOne({ where: { email } }),
      User.findOne({ where: { account } })
    ])
      .then(([userA, userB]) => {
        if (userA) throw new Error('email已重複註冊！')
        if (userB) throw new Error('account已重複註冊！')
        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({
        name,
        account,
        email,
        password: hash
      }))
      .then(userData => {
        userData = userData.toJSON()
        delete userData.password
        return res.json({
          status: 'success',
          data: { user: userData }
        })
      })
      .catch(err => next(err))
  },
  signIn: (req, res, next) => {
    const userData = helpers.getUser(req).toJSON()
    const JWTSecret = process.env.JWT_SECRET || 'SECRET'
    delete userData.password
    if (userData.role === 'admin') {
      const err = new Error('帳號不存在！')
      err.status = 404
      throw err
    }
    try {
      const token = jwt.sign(userData, JWTSecret, { expiresIn: '30d' })
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
  getUser: (req, res, next) => {
    const UserId = req.params.id
    const isFollowed = helpers.getUser(req).Followings.some(f => f.id.toString() === UserId)

    return User.findByPk(UserId, {
      attributes: { exclude: ['password'] },
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
      .then(user => {
        if (!user) {
          const err = new Error('使用者不存在！')
          err.status = 404
          throw err
        }

        const result = {
          ...user.toJSON(),
          followersCount: user.Followers.length,
          followingsCount: user.Followings.length,
          isFollowed
        }
        delete result.Followers
        delete result.Followings
        return res.json(result)
      })
      .catch(err => next(err))
  },
  getUserTweets: (req, res, next) => {
    const UserId = req.params.id
    const likedTweetsId = helpers.getUser(req)?.Likes ? helpers.getUser(req).Likes.map(l => l.TweetId) : []

    return Promise.all([
      User.findByPk(UserId),
      Tweet.findAll({
        where: { UserId },
        include: [
          { model: User, attributes: { exclude: ['password'] } },
          Like,
          Reply
        ],
        order: [['createdAt', 'DESC']]
      })
    ])
      .then(([user, tweets]) => {
        if (!user) {
          const err = new Error('使用者不存在！')
          err.status = 404
          throw err
        }

        const result = tweets.map(tweet => ({
          ...tweet.toJSON(),
          likesCount: tweet.Likes.length,
          repliesCount: tweet.Replies.length,
          isLiked: likedTweetsId.includes(tweet.id)
        }))
        result.forEach(item => {
          delete item.Likes
          delete item.Replies
        })
        return res.json(result)
      })
      .catch(err => next(err))
  },

  getUserReplies: (req, res, next) => {
    const UserId = req.params.id

    return Promise.all([
      User.findByPk(UserId),
      Reply.findAll({
        where: { UserId },
        include: [
          { model: Tweet, include: [{ model: User, attributes: { exclude: ['password'] } }] }
        ],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })
    ])
      .then(([user, replies]) => {
        if (!user) {
          const err = new Error('使用者不存在！')
          err.status = 404
          throw err
        }
        res.json(replies)
      })
      .catch(err => next(err))
  },

  getUserLikes: (req, res, next) => {
    const UserId = req.params.id
    const likedTweetsId = helpers.getUser(req)?.Likes ? helpers.getUser(req).Likes.map(l => l.TweetId) : []

    return Promise.all([
      User.findByPk(UserId),
      Like.findAll({
        where: { UserId },
        include: [{
          model: Tweet,
          include: [
            { model: User, attributes: { exclude: ['password'] } },
            Like,
            Reply
          ]
        }],
        order: [['createdAt', 'DESC']]
      })
    ])
      .then(([User, likes]) => {
        if (!User) {
          const err = new Error('使用者不存在！')
          err.status = 404
          throw err
        }

        const result = likes.map(like => {
          like = like.toJSON()
          like.Tweet.likesCount = like.Tweet.Likes.length
          like.Tweet.repliesCount = like.Tweet.Replies.length
          delete like.Tweet.Likes
          delete like.Tweet.Replies
          like.Tweet.isLiked = likedTweetsId.includes(like.TweetId)
          return like
        })

        res.json(result)
      })
      .catch(err => next(err))
  },
  putUser: async (req, res, next) => {
    try {
      if (helpers.getUser(req).id !== Number(req.params.id)) throw new Error('只能編輯自己的使用者資料！')
      let { name, account, email, password, checkPassword, introduction } = req.body
      const avatar = req.files?.avatar ? await imgurFileHandler(req.files.avatar[0]) : null
      const banner = req.files?.banner ? await imgurFileHandler(req.files.banner[0]) : null

      if (name) {
        if (name.length > 50) throw new Error('暱稱字數超出上限！')
      }
      if (introduction) {
        if (introduction.length > 160) throw new Error('自我介紹字數超出上限！')
      }
      if (password !== checkPassword) throw new Error('密碼與確認密碼不符合！')
      if (password) {
        if (password.length < 5 || password.length > 20) throw new Error('請設定 5 到 20 字的密碼')
        password = await bcrypt.hash(password, 10)
      }
      const userA = await User.findByPk(req.params.id)
      if (!userA) {
        const err = new Error('使用者不存在！')
        err.status = 404
        throw err
      }
      // 如果使用者輸入的 email 和原本一樣，就不用再去檢查 email 是否存在，不然會顯示 email 已重複註冊
      if (email) {
        if (userA.email !== email) {
          const userB = await User.findOne({ where: { email } })
          if (userB) throw new Error('email已重複註冊！')
        }
      }
      // 同上註解
      if (account) {
        if (account.length > 30) throw new Error('帳號字數超出上限！')
        if (userA.account !== account) {
          const userC = await User.findOne({ where: { account } })
          if (userC) throw new Error('account已重複註冊！')
        }
      }
      let updatedUser = await userA.update({
        name: name || userA.name,
        account: account || userA.account,
        email: email || userA.email,
        password: password || userA.password,
        introduction: introduction || userA.introduction,
        avatar: avatar || userA.avatar,
        banner: banner || userA.banner
      })
      updatedUser = updatedUser.toJSON()
      delete updatedUser.password
      return res.json({ status: 'success', data: { user: updatedUser } })
    } catch (err) {
      return next(err)
    }
  },
  getFollowings: (req, res, next) => {
    const followingsId = helpers.getUser(req).Followings.map(fs => fs.id)
    User.findByPk(req.params.id)
      .then(user => {
        if (!user) {
          const err = new Error('使用者不存在！')
          err.status = 404
          throw err
        }
        return Followship.findAll({
          where: { followerId: req.params.id },
          include: { model: User, as: 'Following', attributes: { exclude: 'password' } },
          order: [['createdAt', 'DESC']],
          nest: true,
          raw: true
        })
      })
      .then(followships => {
        const data = followships.map(f => {
          f.Following.isFollowed = followingsId.some(id => id === f.Following.id)
          return f
        })
        return res.json(data)
      })
      .catch(err => next(err))
  },
  getFollowers: (req, res, next) => {
    const followingsId = helpers.getUser(req).Followings.map(f => f.id)
    User.findByPk(req.params.id)
      .then(user => {
        if (!user) {
          const err = new Error('使用者不存在！')
          err.status = 404
          throw err
        }
        return Followship.findAll({
          where: { followingId: req.params.id },
          include: { model: User, as: 'Follower', attributes: { exclude: 'password' } },
          order: [['createdAt', 'DESC']],
          nest: true,
          raw: true
        })
      })
      .then(followships => {
        const data = followships.map(f => {
          f.Follower.isFollowed = followingsId.some(id => id === f.Follower.id)
          return f
        })
        return res.json(data)
      })
      .catch(err => next(err))
  },
  getTopUser: (req, res, next) => {
    const followingsId = helpers.getUser(req).Followings.map(f => f.id)
    User.findAll({
      where: { id: { [Op.ne]: helpers.getUser(req).id } },
      attributes: { exclude: 'password' },
      include: { model: User, as: 'Followers' }
    })
      .then(users => {
        const data = users.map(user => {
          user = user.toJSON()
          user.followersCount = user.Followers.length
          user.isFollowed = followingsId.some(id => id === user.id)
          delete user.Followers
          return user
        })
          .sort((a, b) => b.followersCount - a.followersCount)
          .slice(0, 10)
        return res.json(data)
      })
      .catch(err => next(err))
  }
}

module.exports = userController

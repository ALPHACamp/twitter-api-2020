const createToken = require('../function/token')
const { User, Tweet, Reply, Like, Followship } = require('../models')
const bcrypt = require('bcryptjs')
const { imgurCoverHandler, imgurAvatarHandler } = require('../helpers/file-helpers')

const userController = {
  login: async (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      if (userData.role !== 'user') return res.status(403).json({ status: 'error', message: '非使用者' })
      const token = await createToken(userData)
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
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.checkPassword) res.status(403).json({ status: 'error', message: '密碼與確認密碼不符，請重新輸入' })
    try {
      User.findOne({ where: { email: req.body.email } })
        .then(user => {
          if (user) res.status(403).json({ status: 'error', message: '此Email已被註冊！' })
          return bcrypt.hash(req.body.password, 10)
        })
        .then(hash => User.create({
          name: req.body.name,
          account: req.body.account,
          email: req.body.email,
          password: hash,
          role: 'user'
        }))
        .then(user => {
          res.json({ status: 'success', user })
        })
    } catch (err) {
      next(err)
    }
  },
  getUser: (req, res, next) => {
    try {
      const id = req.params.id
      User.findByPk(id, {
        include: [
          Tweet,
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })
        .then(user => {
          if (!user) res.status(403).json({ status: 'error', message: '找不到使用者！' })
          user = user.toJSON()
          res.json({
            status: 'success',
            ...user,
            followingsCount: user.Followings.length,
            followersCount: user.Followers.length
          })
        })
    } catch (err) {
      next(err)
    }
  },
  getUserTweet: (req, res, next) => {
    try {
      const UserId = req.params.id

      Tweet.findAll({
        where: { UserId },
        include: User,
        raw: true,
        nest: true
      })
        .then(tweet => {
          if (!tweet) {
            res.status(403).json({ status: 'error', message: '找不到使用者的推文！' })
          } else {
            res.json(tweet)
          }
        })
    } catch (err) {
      next(err)
    }
  },
  userRepliedTweets: (req, res, next) => {
    try {
      const UserId = req.params.id
      Reply.findAll({
        where: { UserId },
        include: [Tweet, User],
        raw: true,
        nest: true
      })
        .then(reply => {
          if (!reply) {
            res.status(403).json({ status: 'error', message: '找不到使用者的回覆！' })
          }
          const repeatDataId = []
          const newData = []
          // eslint-disable-next-line array-callback-return
          reply.map(reply => {
            if (!repeatDataId.includes(reply.TweetId)) {
              repeatDataId.push(reply.TweetId)
              newData.push(reply)
            } else {
              return false
            }
          })
          res.json(newData)
        })
    } catch (err) {
      next(err)
    }
  },
  userLikes: (req, res, next) => {
    try {
      const UserId = req.params.id
      Like.findAll({
        where: { UserId },
        include: [User, Tweet],
        raw: true,
        nest: true
      })
        .then(tweet => {
          if (!tweet) {
            res.status(403).json({ status: 'error', message: '此用戶還沒有喜歡的貼文！' })
          } else {
            const repeatDataId = []
            const newData = []
            // eslint-disable-next-line array-callback-return
            tweet.map(tweet => {
              if (!repeatDataId.includes(tweet.tweetId)) {
                repeatDataId.push(tweet.tweetId)
                newData.push(tweet)
              }
            })
            res.json(newData)
          }
        })
    } catch (err) {
      next(err)
    }
  },
  userFollowings: (req, res, next) => {
    try {
      const followerId = req.params.id
      Followship.findAll({
        where: { followerId },
        raw: true
      })
        .then(followings => {
          res.json(followings)
        })
    } catch (err) {
      next(err)
    }
  },
  userFollowers: (req, res, next) => {
    try {
      const followingId = req.params.id
      Followship.findAll({
        where: { followingId },
        raw: true
      })
        .then(followings => {
          res.json(followings)
        })
    } catch (err) {
      next(err)
    }
  },
  putUser: (req, res, next) => {
    try {
      const userId = req.params.id
      const { name, introduction } = req.body
      const { files } = req
      if (!name) throw new Error('請輸入使用者姓名！')
      return Promise.all([
        User.findByPk(userId),
        imgurCoverHandler(files),
        imgurAvatarHandler(files)
      ])
        .then(([user, coverUrl, avatarUrl]) => {
          if (!user) throw new Error('使用者不存在！')
          return user.update({
            name,
            introduction: introduction || user.introduction,
            cover: coverUrl || user.cover,
            avatar: avatarUrl || user.avatar
          })
        })
        .then(user => {
          res.json(user)
        })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController

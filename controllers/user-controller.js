const createToken = require('../helpers/token')
const { User, Tweet, Reply, Like, Followship } = require('../models')
const bcrypt = require('bcryptjs')
const { imgurCoverHandler, imgurAvatarHandler } = require('../helpers/file-helpers')

const userController = {
  login: async (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      if (userData.role !== 'user') throw new Error('非使用者')
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
    if (req.body.password !== req.body.checkPassword) throw new Error('密碼與確認密碼不符，請重新輸入')
    try {
      User.findOne({ where: { email: req.body.email } })
        .then(user => {
          if (user) throw new Error('此Email已被註冊！')
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
          if (!user) throw new Error('找不到使用者！')
          user = user.toJSON()
          res.json({
            status: 'success',
            ...user,
            tweetCount: user.Tweets.length,
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
        order: [['createdAt', 'DESC']],
        include: User,
        raw: true,
        nest: true
      })
        .then(tweet => {
          if (!tweet) throw new Error('找不到使用者的推文！')
          res.json(tweet)
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
        include: [
          {
            model: Tweet,
            include: [
              {
                model: User
              }
            ]
          },
          User],
        raw: true,
        nest: true
      })
        .then(reply => {
          if (!reply) {
            return res.status(403).json({ status: 'error', message: '找不到使用者的回覆！' })
          }
          const repeatDataId = []
          const rawData = []
          // eslint-disable-next-line array-callback-return
          reply.map(reply => {
            if (!repeatDataId.includes(reply.TweetId)) {
              repeatDataId.push(reply.TweetId)
              rawData.push(reply)
            } else {
              return false
            }
          })
          const data = rawData.map(element => ({
            id: element.id,
            comment: element.comment,
            replyAccount: element.Tweet.User.account,
            createAt: element.createdAt
          }))
          res.json(data)
        })
    } catch (err) {
      next(err)
    }
  },
  userLikes: async (req, res, next) => {
    try {
      const UserId = req.params.id
      const rawUserLikes = await Like.findAll({
        where: {
          UserId
        },
        include: [{
          model: Tweet,
          attributes: [
            'id'
          ]
        }],
        nest: true,
        raw: true
      })
      if (!rawUserLikes.length) throw new Error('使用者沒有喜歡的推文')
      const likeTweetId = []

      for (let index = 0; index < rawUserLikes.length; index++) {
        likeTweetId.push(rawUserLikes[index].Tweet.id)
      }

      const likeTweets = await Tweet.findAll({
        where: {
          id: likeTweetId
        },
        include: [
          { model: User }
        ],
        order: [['created_at', 'DESC']],
        nest: true,
        raw: true
      })
      // 推文 like 總數
      const likes = await Like.count({
        group: ['Tweet_id']
      })

      if (likes) {
        likeTweets.forEach(tweet => {
          likes.forEach(element => {
            if (tweet.id === element.Tweet_id) {
              tweet.totalLikeCount = element.count
            } else {
              if (tweet.totalLikeCount === undefined) tweet.totalLikeCount = 0
            }
          })
        })
      } else {
        likeTweets.forEach(element => {
          element.totalLikeCount = 0
        })
      }
      // 推文 reply 總數
      const replies = await Reply.count({
        group: ['Tweet_id']
      })

      if (replies) {
        likeTweets.forEach(tweet => {
          replies.forEach(element => {
            if (tweet.id === element.Tweet_id) {
              tweet.totalReplyCount = element.count
            } else {
              if (tweet.totalReplyCount === undefined) tweet.totalReplyCount = 0
            }
          })
        })
      } else {
        likeTweets.forEach(element => {
          element.totalReplyCount = 0
        })
      }
      const data = likeTweets.map(element => ({
        TweetId: element.id,
        description: element.description,
        createdAt: element.createAt,
        name: element.User.name,
        account: element.User.account,
        avatar: element.User.avatar,
        totalLikeNum: element.totalLikeCount,
        totalReplyNum: element.totalReplyCount
      }))
      res.status(200).json(data)
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
      const { name, account, email, password, checkPassword, introduction } = req.body
      const { files } = req
      if (!name) throw new Error('請輸入使用者姓名！')
      if (!checkPassword) throw new Error('請再輸入一次密碼')
      if (password !== checkPassword) throw new Error('確認密碼有誤，請重新輸入一次')
      return Promise.all([
        User.findByPk(userId),
        User.findOne({ where: { account } }),
        User.findOne({ where: { email } }),
        imgurCoverHandler(files),
        imgurAvatarHandler(files)
      ])
        .then(([user, account, email, coverUrl, avatarUrl]) => {
          if (!user) throw new Error('使用者不存在！')
          if (account) throw new Error('此帳戶已經有人使用')
          if (email) throw new Error('此信箱已經有人使用，請更換其他信箱')
          const newPassword = bcrypt.hashSync(password, 10)
          return user.update({
            name,
            account: account || user.account,
            email: email || user.email,
            password: newPassword,
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
  },
  getTopUsers: (req, res, next) => { // 重寫
    try {
      User.findAll({
        include: [{ model: User, as: 'Followers' }],
        nest: true
      })
        .then(user => {
          const newData = []
          // eslint-disable-next-line array-callback-return
          user.map(user => {
            user = user.toJSON()
            delete user.password
            newData.push(user)
          })
          res.json({
            newData
          })
        })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController

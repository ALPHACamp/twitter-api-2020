const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { Sequelize, Op } = require('sequelize')
const { getUser } = require('../_helpers')

const { User, Tweet, Like, Reply } = require('../models')

const userController = {
  signIn: (req, res, next) => {
    try {
      if (req.user.error) {
        return res.status(404).json(req.user.error)
      }

      if (req.user.role !== 'user') {
        return res.status(400).json({
          status: 'error',
          message: '帳號或密碼錯誤!'
        })
      }

      const userData = req.user.toJSON()
      delete userData.password
      delete userData.introduction
      delete userData.createdAt
      delete userData.updatedAt
      const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: '30d'
      })
      return res.status(200).json({
        status: 'success',
        token,
        user: userData
      })
    } catch (err) {
      next(err)
    }
  },
  signUp: async (req, res, next) => {
    try {
      const { account, password, checkPassword, name, email } = req.body

      if (!account || !name || !email || !password || !checkPassword) {
        return res.status(400).json({
          status: 'error',
          message: '欄位不可以空白!'
        })
      }

      if (password !== checkPassword) {
        return res.status(400).json({
          status: 'error',
          message: '密碼與確認密碼不同!'
        })
      }

      const userExist = await User.findAll({
        where: {
          [Op.or]: [
            { account },
            { email }
          ]
        }
      })

      if (userExist.length > 0) {
        return res.status(400).json({
          status: 'error',
          message: '帳號或信箱已有人使用了!'
        })
      }

      if (name.length > 50) {
        return res.status(400).json({
          status: 'error',
          message: '使用者名字不可超過50字!'
        })
      }

      const hash = await bcrypt.hash(password, 10)
      const user = await User.create({
        name,
        account,
        email,
        password: hash,
        role: 'user'
      })
      const userData = user.toJSON()
      delete userData.password
      return res.status(200).json({ status: 'success', user: userData })
    } catch (error) {
      next(error)
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const limit = Number(req.query.limit) || null
      const users = await User.findAll({
        where: { role: 'user' },
        include: [{
          model: User,
          as: 'Followers',
          attributes: [
            'id',
            'name',
            'avatar',
            'account'
          ]
        }],
        attributes: [
          'id',
          'name',
          'avatar',
          'account',
          [
            Sequelize.literal(
              '(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)'
            ),
            'followersCount'
          ]
        ],
        order: [[Sequelize.literal('followersCount'), 'DESC'], ['name', 'ASC']],
        limit
      })
      return res.status(200).json({ status: 'success', users })
    } catch (error) {
      next(error)
    }
  },
  getCurrentUser: async (req, res, next) => {
    try {
      const user = getUser(req)
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: '使用者不存在!'
        })
      }
      const { id, account, name, email, avatar, frontCover, role } = user.toJSON()
      const userData = {
        id, account, name, email, avatar, frontCover, role
      }
      res.status(200).json({
        user: userData
      })
    } catch (error) {
      next(error)
    }
  },
  getUser: async (req, res, next) => {
    try {
      const userId = req.params.id
      let user = await User.findByPk(userId, {
        include: [
          { model: Tweet },
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' }
        ]
      })

      if (!user || user.role === 'admin') res.status(404).json({ status: 'error', message: '找不到使用者' })

      user = await user.toJSON()
      const isFollowed = user.Followers.some(followers => followers.id === req.user.id)
      delete user.password

      return res.status(200).json({
        status: 'success',
        message: '成功取得使用者資料!',
        ...user,
        tweetsCount: user.Tweets.length,
        followingsCount: user.Followings.length,
        isFollowed
      })
    } catch (error) {
      next(error)
    }
  },
  getUserLikes: async (req, res, next) => {
    try {
      const userId = req.params.id
      const user = await User.findByPk(userId)
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: '使用者不存在!'
        })
      }
      let likes = await Like.findAll({
        where: { UserId: userId },
        order: [
          ['createdAt', 'DESC']
        ],
        include: [
          {
            model: Tweet,
            include: [User, Like, Reply]
          }
        ]
      })

      likes = await likes.map(like => like.toJSON())
      likes = likes.map(like => {
        const likedTweet = like.Tweet
        return {
          likeCreatedAt: like.createdAt, // Like創建時間
          TweetId: likedTweet.id, // 喜歡推文 id
          description: likedTweet.description, // 喜歡推文內容
          createdAt: likedTweet.createdAt, // 喜歡推文創建時間
          userOfLikedTweet: likedTweet.User.id, // 喜歡推文的使用者id
          userNameOfLikedTweet: likedTweet.User.name, // 喜歡推文的使用者名子
          userAccountOfLikedTweet: likedTweet.User.account, // 喜歡推文的使用者帳戶名子
          userAvatarOfLikedTweet: likedTweet.User.avatar, // 喜歡推文的使用者avatar
          repliedCount: likedTweet.Replies.length, // 喜歡推文的回應數量
          likesCount: likedTweet.Likes.length // 喜歡推文的喜歡數量
        }
      })
      return res.status(200).json(likes)
    } catch (err) {
      next(err)
    }
  },
  getUserFollowing: async (req, res, next) => {
    try {
      const userId = req.params.id
      const user = await User.findByPk(userId, {
        include: [{ model: User, as: 'Followings' }],
        order: [['createdAt', 'DESC']]
      })
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: '使用者不存在!'
        })
      }
      const followingUser = user.Followings.map(following => {
        return {
          followingId: following.id,
          followingName: following.name,
          followingAvatar: following.avatar,
          followingAccount: following.account,
          followingIntroduction: following.introduction,
          isFollowing: getUser(req).Followings ? getUser(req).Followings.some(f => f.id === following.id) : false,
          createdAt: following.Followship.createdAt
        }
      })
      return res.status(200).json(followingUser)
    } catch (err) {
      next(err)
    }
  },
  getUserFollower: async (req, res, next) => {
    try {
      const userId = req.params.id
      const user = await User.findByPk(userId, {
        include: [{ model: User, as: 'Followers' }],
        order: [['createdAt', 'DESC']]
      })
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: '使用者不存在!'
        })
      }
      const followerUser = user.Followers.map(follower => {
        return {
          followerId: follower.id,
          followerName: follower.name,
          followerAvatar: follower.avatar,
          followerAccount: follower.account,
          followerIntroduction: follower.introduction,
          isFollower: getUser(req).Followers ? getUser(req).Followers.some(f => f.id === follower.id) : false,
          createdAt: follower.Followship.createdAt
        }
      })
      return res.status(200).json(followerUser)
    } catch (err) {
      next(err)
    }
  },
  getUserTweets: async (req, res, next) => {
    try {
      const userId = req.params.id
      const currentUserId = getUser(req).id

      if (!userId) {
        return res.status(404).json({
          status: 'error',
          message: '使用者不存在!'
        })
      }
      let tweets = await Tweet.findAll({
        where: { UserId: userId },
        attributes: [
          'id',
          'description',
          'createdAt',
          [
            Sequelize.literal(
              '(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'
            ),
            'LikesCount'
          ],
          [
            Sequelize.literal(
              '(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'
            ),
            'RepliesCount'
          ]
        ],
        include: { model: Like },
        order: [
          ['createdAt', 'DESC']
        ]
      })

      tweets = tweets.map(tweet => tweet.toJSON())
      tweets = tweets.map(tweet => {
        const isLiked = tweet.Likes.some(likes => likes.UserId === currentUserId)
        delete tweet.Likes
        return {
          ...tweet,
          isLiked
        }
      })

      res.status(200).json(tweets)
    } catch (err) {
      next(err)
    }
  },
  getRepliedTweets: async (req, res, next) => {
    try {
      const userId = req.params.id
      const user = await User.findByPk(userId)
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: '使用者不存在!'
        })
      }
      const replied = await Reply.findAll({
        where: { UserId: userId },
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'UserId', 'TweetId', 'comment', 'createdAt'],
        include: [
          {
            model: Tweet,
            attributes: ['id', 'UserId'],
            include: [
              {
                model: User,
                attributes: ['id', 'account', 'name', 'avatar']
              }
            ]
          }
        ],
        raw: true,
        nest: true
      })
      return res.status(200).json(replied)
    } catch (err) {
      next(err)
    }
  },
  putUser: async (req, res, next) => {
    try {
      const userId = Number(req.params.id)
      // const currentUserId = getUser(req).id
      const { account, name, email, password, checkPassword, introduction } = req.body
      // front_cover, avatar

      // if (userId !== currentUserId) {
      //   return res.status(403).json({
      //     status: 'error',
      //     message: '無編輯權限'
      //   })
      // }

      const user = await User.findByPk(userId)
      const editData = {}

      // account verify
      if (account && user.account !== account) {
        const otherUser = await User.findOne({ where: { account, role: 'user' } })
        if (otherUser) {
          return res.status(400).json({
            status: 'error',
            message: '帳號已被使用！'
          })
        }
        editData.account = account
      }

      // email verify
      if (email && user.email !== email) {
        const otherUser = await User.findOne({ where: { email, role: 'user' } })
        if (otherUser) {
          return res.status(400).json({
            status: 'error',
            message: '電子信箱已被使用！'
          })
        }
        editData.email = email
      }

      // name verify
      if (name && name !== user.name) {
        if (name.length > 50) {
          return res.status(400)
            .json({
              status: 'error',
              message: 'name 不能超過 50 字！'
            })
        }
        editData.name = name
      }

      // password verify
      if (password) {
        if (!checkPassword) {
          return res.status(400).json({
            status: 'error',
            message: 'checkPassword 不能為空！'
          })
        }

        if (password !== checkPassword) {
          return res.status(400).json({
            status: 'error',
            message: '兩次填寫的密碼不同！'
          })
        }
        editData.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      }

      // introduction verify
      if (introduction && introduction !== user.introduction) {
        if (introduction.length > 160) {
          return res.status(400).json({
            status: 'error',
            message: '自介不可超過 160 字！'
          })
        }
        editData.introduction = introduction
      }

      if (!Object.keys(editData).length) {
        res.status(400).json({
          status: 'error',
          message: '沒有編輯任何欄位！'
        })
      }

      let newData = await user.update(editData)
      newData = newData.toJSON()
      delete newData.password
      delete newData.role
      delete newData.createdAt

      return res.status(200).json({
        status: 'success',
        message: '編輯成功！',
        newData
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = userController

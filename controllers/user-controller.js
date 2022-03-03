const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')
const validator = require('validator')
const { Op } = require('sequelize')
const { User, Like, Tweet, Followship, Reply } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const userController = {
  signUp: async (req, res, next) => {
    try {
      const { name, account, email, password, checkPassword } = req.body

      if (!name || !account || !email || !password || !checkPassword) throw new Error('欄位必須全部填完')

      if (email && !validator.isEmail(email)) throw new Error('請輸入正確信箱格式')
      
      if (password && !validator.isByteLength(password, { min: 4 })) throw new Error('密碼請輸入至少 4 個!')

      if (password !== checkPassword) throw new Error('兩次密碼不相符')

      if (name && !validator.isByteLength(name, { min: 0, max: 50 })) throw new Error('名字長度不能超過 50 個字')
      
      const checkedUser = await User.findOne({
        where: {
          [Op.or]: [{ account }, { email }]
        },
        raw: true
      })
      
      if (checkedUser) throw new Error('account 或 email 已註冊!')
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)
      
      await User.create({
        name,
        account,
        email,
        password: hash,
      })
      res.status(200).json({
        status: 'success',
        message: 'Account success created!'
      })
    } catch (err) { next(err) }
  },
  signIn: async (req, res, next) => {
    try {
      const user = helpers.getUser(req).toJSON()

      if (user.role !== 'user') throw new Error('Not found user')
      
      delete user.password
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'success',
        message: 'login success!',
        data: {
          token,
          user
        }
      })
    } catch (err) { next(err) }
  },
  getUser: async (req, res, next) => {
    try {
      const { id } = req.params
      const userData = await User.findByPk(id, {
        raw: true
      })
      const followship = await Followship.findOne({
        where: {
          followerId: req.user.id,
          followingId: id
        }
      })
      if (!userData) {
        throw new Error('User not found!')
      } else {
        if (followship) {
          userData.isFollowed = true
        } else {
          userData.isFollowed = false
        }
        delete userData.password
        res.json(userData)
      }
    } catch (err) { next(err) }
  },
  getUserTweets: async (req, res, next) => {
    try {
      const { id } = req.params
      const user = await User.findByPk(req.params.id)
      if (!user) {
        return res
          .status(404)
          .json({
            status: 'error',
            message: 'Not found user'
          })
      }
      const tweets = await Tweet.findAll({
        where: { UserId: id },
        raw: true,
        include: [
          {
            model : User,
            attributes: ['id', 'name', 'account', 'avatar']
          }, 
          {
            model: User,
            as: 'LikedUsers',
            attributes: ['id']
          }
        ],
        nest: true,
        order: [['createdAt', 'desc']]
      })
      if (tweets.length === 0) return res.status(400).json({
        status: 'error',
        message: 'Tweet not found!'
      })
      tweetsData = tweets.map(tweet => ({
        ...tweet,
        isLiked: tweet.LikedUsers.id !== null
      }))
      return res.json(tweetsData)
    } catch (err) { next(err) }
  },
  getUserLikes: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id)
      if (!user) {
        return res
          .status(404)
          .json({
            status: 'error',
            message: '使用者不存在'
          })
      }
      const likes = await Like.findAll({
        where: {
          UserId: req.params.id,
          isDeleted: false
        },
        order: [['createdAt', 'desc']],
        include: [
          {
            model: Tweet,
            as: "LikedTweet",
            attributes: ['id','UserId','description','replyCount','likeCount'],
            include: [
              {
                model: User,
                attributes: ['id','name', 'account','avatar']
              }
            ]
          }
        ]
      })
      if (likes.length == 0) {
        return res
          .status(400)
          .json({
            status: 'error',
            message: '使用者沒有喜歡過的推文'
          })
      }
      const userLikes = likes
        .map(like => ({
          ...like.toJSON(),
          isLiked: true
        }))
      return res.status(200).json(userLikes)
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error
      })
    }
  },
  getUserReplies: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id)
      if (!user) {
        return res
          .status(404)
          .json({
            status: 'error',
            message: '使用者不存在'
          })
      }
      const replies = await Reply.findAll({
        where: {
          UserId: req.params.id
        },
        order: [['createdAt', 'desc']],
        attributes: ['comment', 'createdAt', 'updatedAt'],
        include: [
          {
            model: Tweet,
            attributes: ['id'],
            include: [
              {
                model: User,
                attributes: ['account']
              }
            ]
          },
          {
            model: User,
            attributes: ['id', 'name', 'account','avatar']
          }
        ]
      })
      if (replies.length === 0) {
        return res
          .status(400)
          .json({
            status: 'error',
            message: '使用者沒有回覆過的貼文'
          })
      } else {
        return res.status(200).json(replies)
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error
      })
    }
  },
  getUserFollowings: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id)
      const followship = await Followship.findAll({
        where: {
          followerId: req.params.id
        },
        include: {
          model: User,
          as: 'following',
          attributes: [
            'id',
            'account',
            'name',
            'avatar',
            'introduction'
          ],
        },
        attributes: ['id', 'followingId', 'followerId', 'createdAt'],
        order: [['createdAt', 'desc']]
      })
      if (!user) {
        return res
          .status(404)
          .json({
            status: 'error',
            message: '使用者不存在'
          })
      }
      if (followship.length === 0) {
        return res
          .status(400)
          .json({
            status: 'error',
            message: '此使用者沒有追蹤任何人'
          })
      } else {
        const userFollowings = followship
        .map(userFollowing => ({
          ...userFollowing.toJSON(),
          isFollowed: true
        }))
        return res.status(200).json(userFollowings)
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error
      })
    }
  },
  getUserFollowers: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id)
      const followships = await Followship.findAll({
        where: {
          followingId: req.params.id
        },
        order: [['createdAt', 'desc']],
        include: {
          model: User,
          as: 'follower',
          attributes: [
            'id',
            'account',
            'name',
            'avatar',
            'introduction'
          ]
        }
      })
      if (!user) {
        return res
          .status(404)
          .json({
            status: 'error',
            message: '使用者不存在'
          })
      }
      if (followships.length === 0) {
        return res
          .status(400)
          .json({
            status: 'error',
            message: '此使用者沒有跟隨者'
          })
      } else {
        followshipsData = followships.map((followship) => {
          const { id, followerId, followingId, createdAt, updatedAt, follower} = followship
          return {
            id,
            followerId,
            followingId,
            createdAt,
            updatedAt,
            follower,
            isFollowed: followship.followerId === helpers.getUser(req).id
          }
        })
        console.log(followships)
        return res.status(200).json(followshipsData)
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error
      })
    }
  },
  getTopUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        include: [{ 
          model: User, 
          as: 'Followers', 
          attributes:['id','name','account']
        }],
        attributes: ['id', 'name', 'account', 'avatar']
      })
      const usersTop = users
        .map(user => ({
          ...user.toJSON(),
          followerCount: user.Followers.length,
          isFollowed: req.user.Followings.some(f => f.id === user.id)
        }))
        .sort((a, b) => b.followerCount - a.followerCount)
        .slice(0, 10)
      return res.status(200).json(usersTop)
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error
      })
    }
  },
  putUser: async (req, res, next) => {
    try {
      const id = +req.params.id
      const userId = helpers.getUser(req).id
      const { account, name, email, password, checkPassword, introduction, cover, avatar } = req.body
      const { files } = req

      if (userId !== id) return res.status(400).json({
        status: 'error',
        message: 'No permission'
      })
      if (email && !validator.isEmail(email)) throw new Error('請輸入正確信箱格式')

      if (password && !validator.isByteLength(password, { min: 4 })) throw new Error('密碼請輸入至少 4 個!')

      if (password !== checkPassword) throw new Error('兩次密碼不相符')

      if (name && !validator.isLength(name, { min: 0, max: 50 })) throw new Error('名字長度不能超過 50 個字')

      if (introduction && !validator.isLength(introduction, { min: 0, max: 160 })) throw new Error('自我介紹不能超過 160 個字')
      // 列出全部有相同 account or email 的 user
      const checkedUser = await User.findAll({
        where: { [Op.or]: [{ account }, { email }]},
        attributes: ['id', 'name', 'account', 'email', 'avatar', 'introduction', 'role'],
        raw: true
      })
      
      const otherUser = checkedUser.find(user => user.id !== userId)
      
      if (otherUser) throw new Error('account or email 已被使用')
      
      delete req.body.checkPassword

      if (password) {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        req.body.password = hash
      }
      
      const imgurUploadAvatar = files?.avatar ? await imgurFileHandler(files.avatar[0]) : null
      const imgurUploadCover = files?.cover ? await imgurFileHandler(files.cover[0]) : null
      if (imgurUploadAvatar) req.body.avatar = imgurUploadAvatar.toString()
      if (imgurUploadCover) req.body.cover = imgurUploadCover.toString()
      
      const user = await User.findByPk(id)
      const updatedUser = await user.update(req.body)
      const data = updatedUser.toJSON()
      delete data.password

      res.json({
        status: 'success',
        message: 'putUser success',
        updateduser: data
      })
    } catch (err) { next(err) }
  },
  getCurrentUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: [
          'id',
          'account',
          'name',
          'email',
          'avatar',
          'cover',
          'role'
        ]
      })
      if (!user) throw new Error('user not found')
      res.json({ user })
    } catch (err) { next(err) }
  }
}

module.exports = userController
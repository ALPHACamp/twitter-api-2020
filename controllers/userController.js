const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Like = db.Like
const Reply = db.Reply
const Followship = db.Followship
const { Op } = require('sequelize')

const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const userController = {
  signUp: (req, res) => {
    if (!req.body.name || !req.body.account || !req.body.email || !req.body.password || !req.body.checkPassword) {
      return res.json({ status: 'error', message: '每個欄位都是必要欄位！' })
    } else if (req.body.checkPassword !== req.body.password) {
      return res.json({ status: 'error', message: '兩次密碼輸入不同！' })
    } else {
      User.findOne({
        where: {
          [Op.or]: [
            { email: req.body.email },
            { account: req.body.account }
          ]
        }
      }).then(user => {
        if (user) {
          if (user.email === req.body.email) {
            return res.json({ status: 'error', message: '信箱重複！' })
          } else if (user.account === req.body.account) {
            return res.json({ status: 'error', message: '帳號重複！' })
          }
        } else {
          User.create({
            account: req.body.account,
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            return res.json({ status: 'success', message: '成功註冊帳號！' })
          })
        }
      })
    }
  },
  logIn: (req, res) => {
    if (!req.body.account || !req.body.password) {
      return res.json({ status: 'error', message: "required fields didn't exist" })
    }
    const account = req.body.account
    const password = req.body.password

    User.findOne({ where: { account: account } }).then(user => {
      if (!user) return res.status(401).json({ status: 'error', message: 'no such user found' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: 'passwords did not match' })
      }
      const payload = { id: user.id, role: user.role }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.json({
        status: 'success',
        message: 'ok',
        token: token,
        user: {
          id: user.id, name: user.name, email: user.email, role: user.role
        }
      })
    })
  },
  getUser: (req, res) => {
    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) {
          return res.status(404).json({
            status: 'error',
            message: 'User not found.'
          })
        }
        const { id, name, account, avatar, cover, introduction, followerCount, followingCount } = user
        return res.status(200).json({
          id, name, account, avatar, cover, introduction, followerCount, followingCount
        })
      })
  },
  getUserTweets: (req, res) => {
    const UserId = req.params.id
    return User.findByPk(UserId)
      .then(user => {
        if (!user) {
          return res.status(400).json({
            status: 'error',
            message: 'This user does not exist.'
          })
        }
        return Tweet.findAll({
          where: { UserId },
          attributes: {
            exclude: ['UserId', 'updatedAt']
          }
        }).then(tweets => {
          return res.status(200).json(tweets)
        })
      })
  },
  getUserLikes: (req, res) => {
    const UserId = req.params.id
    const viewerId = req.user.id
    return User.findByPk(UserId)
      .then(user => {
        if (!user) {
          return res.status(400).json({
            status: 'error',
            message: 'This user does not exist.'
          })
        }
        return Like.findAll({
          include: [
            {
              model: Tweet,
              attributes: ['id', 'description', 'createdAt', 'replyCount', 'likeCount']
            },
            {
              model: User,
              attributes: ['id', 'name', 'account', 'avatar']
            }
          ],
          where: { UserId },
          attributes: ['TweetId']
        }).then(likes => {
          likes.forEach(like => {
            like = like.toJSON()
            if (like.User.id === viewerId) {
              like.Tweet.isLike = true
            } else {
              like.Tweet.isLike = false
            }
          })
          return res.status(200).json(likes)
        })
      })
  },
  getUserFollowings: (req, res) => {
    const UserId = req.params.id
    const viewerId = req.user.id
    return User.findAll({
      include: [
        {
          model: User,
          as: 'Followings',
          attributes: ['id', 'name', 'account', 'avatar', 'introduction'],
          nest: true,

          include: {
            model: User,
            as: 'Followers',
            attributes: ['id'],
            where: { id: viewerId },
            nest: true,
            required: false
          }
        }
      ],
      where: { id: UserId },
      attributes: [],
      nest: true,
      raw: true
    }).then(async data => {
      data = data.map((item, i) => {
        const mapItem = {
          ...item.dataValues,
          followingId: item.Followings.id,
          Followings: {
            ...item.Followings,
            isFollowing: Boolean(item.Followings.Followers.id)
          }
        }
        delete mapItem.Followings.Followship
        delete mapItem.Followings.Followers.Followship
        delete mapItem.Followings.Followers
        return mapItem
      })
      return res.status(200).json(data)
    })
  },
  getUserFollowers: (req, res) => {
    const UserId = req.params.id
    const viewerId = req.user.id
    return User.findAll({
      include: [
        {
          model: User,
          as: 'Followers',
          attributes: ['id', 'name', 'account', 'avatar', 'introduction'],
          nest: true,

          include: {
            model: User,
            as: 'Followers',
            attributes: ['id'],
            where: { id: viewerId },
            nest: true,
            required: false
          }
        }
      ],
      where: { id: UserId },
      attributes: [],
      nest: true,
      raw: true
    }).then(async data => {
      data = data.map((item, i) => {
        const mapItem = {
          ...item.dataValues,
          followerId: item.Followers.id,
          Followers: {
            ...item.Followers,
            isFollowing: Boolean(item.Followers.Followers.id)
          }
        }
        delete mapItem.Followers.Followship
        delete mapItem.Followers.Followers.Followship
        delete mapItem.Followers.Followers
        return mapItem
      })
      return res.status(200).json(data)
    })
  }
}

module.exports = userController

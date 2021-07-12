const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Tweet, Like, Reply, Followship, Sequelize } = db
const { Op } = require('sequelize')

// const imgur = require('imgur-node-api')
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

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
    const viewerId = req.user.id

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
          attributes: [
            ['id', 'TweetId'],
            'description', 'createdAt', 'replyCount', 'likeCount',
            [Sequelize.literal(`exists (select * from Likes where Likes.UserId = '${viewerId}' and Likes.TweetId = Tweet.id)`), 'isLike']
          ],
          include: [
            {
              model: User,
              attributes: ['id', 'name', 'account', 'avatar']
            },
            {
              model: Like, attributes: []
            }
          ]
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
          likes = likes.map((like, i) => {
            const userObj = {
              ...like.User.dataValues
            }

            const mapItem = {
              ...like.dataValues,
              ...like.Tweet.dataValues,
              isLike: like.User.id === viewerId
            }

            delete mapItem.Tweet
            delete mapItem.id
            delete mapItem.User

            mapItem.User = userObj

            return mapItem
          })

          return res.status(200).json(likes)
        })
      })
  },
  getUserFollowings: (req, res) => {
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
      }).then(user => {
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
      })
  },
  getUserFollowers: (req, res) => {
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
      }).then(user => {
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
      })
  },
  getTopUsers: (req, res) => {
    const viewerId = req.user.id

    return User.findAll({
      include: {
        model: User,
        as: 'Followers',
        where: { id: viewerId },
        attributes: ['id'],
        required: false,
        nest: true
      },
      where: { role: 'user' },
      attributes: ['id', 'name', 'account', 'avatar', 'introduction', 'followerCount'],
      order: [['followerCount', 'DESC']],
      limit: 10,
      nest: true,
      raw: true
    }).then(users => {
      users = users.map((item, i) => {
        const mapItem = {
          ...item,
          isFollowing: Boolean(item.Followers.id)
        }
        delete mapItem.Followers
        delete mapItem.followerCount
        return mapItem
      })
      return res.status(200).json(users)
    })
  },

  putUser: (req, res) => {
    const UserId = req.params.id
    const viewerId = req.user.id

    if (Number(UserId) !== viewerId) {
      return res.status(400).json({
        status: 'error',
        message: 'This is not this user\'s account.'
      })
    }

    if (!req.body.name) {
      return res.status(400).json({
        status: 'error',
        message: 'User name required.'
      })
    }

    const { files } = req

    // TODO：改善重複上傳的問題
    if (files) {
      imgur.setClientId(IMGUR_CLIENT_ID)
      const avatar = files.avatar ? imgur.uploadFile((files.avatar[0].path)) : null
      const cover = files.cover ? imgur.uploadFile((files.cover[0].path)) : null

      Promise.all([avatar, cover])
        .then(images => {
          return User.findByPk(UserId)
            .then(user => {
              user.update({
                name: req.body.name,
                introduction: req.body.introduction,
                avatar: files.avatar ? images[0].link : user.avatar,
                cover: files.cover ? images[1].link : user.cover
              })
              return res.status(200).json({
                status: 'success',
                message: 'User successfully updated.'
              })
            })
        })
    } else {

      return User.findByPk(UserId)
        .then((user) => {
          user.update({
            name: req.body.name,
            introduction: req.body.introduction,
            avatar: user.avatar,
            cover: user.cover
          }).then(() => {
            return res.status(200).json({
              status: 'success',
              message: 'User successfully updated.'
            })
          })
        })
    }
  },

  putUserSettings: (req, res) => {
    const UserId = Number(req.params.id)
    const viewerId = req.user.id
    if (UserId !== viewerId) {
      return res.status(400).json({
        status: 'error',
        message: 'This is not this user\'s account.'
      })
    }

    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) {
          return res.status(400).json({
            status: 'error',
            message: 'This user does not exist.'
          })
        }
        if (!req.body.account || !req.body.name || !req.body.email || !req.body.password || !req.body.checkPassword) {
          return res.status(400).json({
            status: 'error',
            message: 'Required fields missing.'
          })
        }
        if (req.body.password !== req.body.checkPassword) {
          return res.status(400).json({
            status: 'error',
            message: 'Password should be as same as checkPassword'
          })
        }

        return user.update({
          account: req.body.account,
          name: req.body.name,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
        }).then(() => {
          return res.status(200).json({
            status: 'success',
            message: 'User successfully updated.',
            user: { id: UserId }
          })
        }).catch(err => {
          return res.status(400).json({
            status: 'error',
            message: err.errors[0].message
          })
        })

      })
  },
  
  getUserRepliedTweets: (req, res) => {
    const UserId = req.params.id
    const viewerId = req.user.id

    return User.findByPk(UserId)
      .then(user => {
        if (!user) {
          return res.status(400).json({
            status: 'error',
            error: 'This user does not exist.'
          })
        }

        return Reply.findAll({
          where: { UserId },
          include: [
            { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
            {
              model: Tweet,
              attributes: ['id', 'description', 'replyCount', 'likeCount'],
              include: { model: Like, separate: true, where: { UserId: viewerId }, required: false }
            }
          ],
          attributes: ['id', 'comment'],
          nest: true
        }).then(replies => {
          replies = replies.map((item, i) => {
            const userObj = {
              ...item.User.dataValues
            }

            const mapItem = {
              TweetId: item.Tweet.dataValues.id,
              ...item.dataValues,
              ...item.Tweet.dataValues,
              isLike: Boolean(item.Tweet.Likes[0]),
            }

            delete mapItem.Tweet
            delete mapItem.Likes
            delete mapItem.id
            delete mapItem.User

            mapItem.User = userObj

            return mapItem
          })
          return res.status(200).json(replies)
        })
      })
  },

  getCurrentUser: (req, res) => {
    const currentUserId = req.user.id

    return User.findByPk(currentUserId, {
      attributes: [
        'id', 'name', 'account', 'avatar',
        [Sequelize.literal(`exists (SELECT * FROM users WHERE role = 'dmin' and id = '${req.user.id}')`), 'isAdmin']
      ]
    }).then(user => {
      return res.status(200).json(user)
    })
  }

}

module.exports = userController

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User, Tweet, Reply, Like, Followship } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.confirmPassword) throw new Error('Passwords do not match!')
    if (User.findOne({ where: { account: req.body.account } })) throw new Error('Account has already been take.')
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({ // 上面錯誤狀況都沒發生，就把使用者的資料寫入資料庫
        name: req.body.name,
        account: req.body.account,
        email: req.body.email,
        password: hash
      }))
      .then(user => {
        res.json({
          status: 'success',
          data: {
            user
          }
        })
      })
      .catch(err => next(err))
  },
  signIn: (req, res, next) => {
    if (req.user.role === 'admin') throw new Error("Admin doen't have permission!") // admin 不能登入
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
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
    return User.findOne({
      where: { id: req.params.id, role: 'user' },
      include: [
        { model: User, as: 'Followers', attributes: ['id', 'account', 'avatar', 'name'] },
        { model: User, as: 'Followings', attributes: ['id', 'account', 'avatar', 'name'] }
      ],
      order: [['createdAt', 'DESC']]
    })
      .then(user => {
        if (!user) throw new Error("User doen't have permission!")
        user = user.toJSON()
        delete user.password
        return res.json({
          status: 'success',
          statusCode: 200,
          data: {
            user,
            followerCount: user.Followers.length,
            followingCount: user.Followings.length
          },
          message: ''
        })
      })
      .catch(err => next(err))
  },
  getCurrentUser: (req, res, next) => {
    const currentUser = res.locals.user.toJSON()
    return currentUser
  },
  putUser: (req, res, next) => {
    if (Number(req.params.id) !== Number(req.user.id)) {
      throw new Error("User doen't have permission!")
    }
    const { account, name, password, email, introduction } = req.body
    const hash = bcrypt.hashSync(password, 10)
    const { avatar } = req
    const { cover } = req
    if (!name) throw new Error('User name is required!')
    if (!account) throw new Error('Account is required!')
    if (!password) throw new Error('Password is required!')
    if (!email) throw new Error('Email is required!')
    if (account !== req.user.account && User.findOne({ where: { account } })) throw new Error('Account has already been take.')
    if (email !== req.user.email && User.findOne({ where: { email } })) throw new Error('Email has already been take.')
    imgurFileHandler(avatar)
    imgurFileHandler(cover)
    return User.findByPk(req.params.id)
      .then(user => {
        user.update({
          name, account, email, password: hash, avatar: avatar || null, cover: cover || null, introduction
        })
        user = user.toJSON()
        delete user.password
        return res.json({
          status: 'success',
          data: {
            user
          }
        })
      })
      .catch(err => next(err))
  },
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      where: { userId: req.params.id },
      include: [{
        model: Reply,
        as: 'Replies',
        attributes: ['id']
      }, {
        model: Like,
        as: 'Likes',
        attributes: ['id']
      }],
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        if (!tweets) throw new Error('This account does not exist.')
        const resultTweets = tweets.map(t => ({ ...t.toJSON(), replyCount: t.Replies.length, likeCount: t.Likes.length }))
        return res.json({
          status: 'success',
          data: {
            tweets: resultTweets
          }
        })
      }).catch(err => next(err))
  },
  getRepliedTweets: (req, res, next) => {
    return Reply.findAll({
      where: { userId: req.params.id },
      include: [{
        model: Tweet,
        as: 'Tweets',
        attributes: ['usereId'],
        include: [{
          model: User,
          as: 'Users',
          attributes: ['account']
        }]
      }],
      order: [['createdAt', 'DESC']]
    })
      .then(replies => {
        if (!replies) throw new Error('This account does not exist.')
        const resultReplies = replies.toSJON()
        return res.json({
          status: 'success',
          data: {
            tweets: resultReplies
          }
        })
      }).catch(err => next(err))
  },
  getLikes: (req, res, next) => {
    return Like.findAll({
      where: { userId: req.params.id },
      include: [{
        model: Tweet,
        as: 'Tweets',
        attributes: ['description']
      }, {
        model: Reply,
        as: 'Replies',
        attributes: ['id']
      }, {
        model: Like,
        as: 'Likes',
        attributes: ['id']
      },
      {
        model: User,
        as: 'Users',
        attributes: ['name, account']
      }],
      order: [['createdAt', 'DESC']]
    })
      .then(likes => {
        if (!likes) throw new Error('This account does not exist.')
        const resultLikes = likes.map(l => ({ ...l.toJSON(), replyCount: l.Replies.length, likeCount: l.Likes.length }))
        return res.json({
          status: 'success',
          data: {
            tweets: resultLikes
          }
        })
      }).catch(err => next(err))
  },
  getFollowings: (req, res, next) => {
    return Followship.findAll({
      where: { followerId: req.params.id },
      include: [
        { model: User, as: 'Followings', attributes: ['id', 'account', 'avatar', 'name', 'introduction'] }
      ],
      order: [['createdAt', 'DESC']]
    }).then(followings => {
      followings = followings.toJSON()
      return res.json({
        status: 'success',
        data: {
          followings
        }
      })
    })
  },
  getFollowers: (req, res, next) => {
    return Followship.findAll({
      where: { followingId: req.params.id },
      include: [
        { model: User, as: 'Followers', attributes: ['id', 'account', 'avatar', 'name', 'introduction'] },
        { model: User, as: 'Followings', attributes: ['id', 'account', 'avatar', 'name', 'introduction'] }
      ],
      order: [['createdAt', 'DESC']]
    }).then(followers => {
      const resultFollowers = followers.map(f => ({
        ...f.toJSON(),
        isFollowing: Followship.findOne({
          where: { followerId: f.followers.folloingId }
        })
      }))
      followers = followers.toJSON()
      return res.json({
        status: 'success',
        data: {
          resultFollowers
        }
      })
    })
  }
}
module.exports = userController

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User, Tweet, Reply, Like } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.checkPassword) throw new Error('Passwords do not match!')
    Promise.all([User.findOne({ where: { account: req.body.account } }), User.findOne({ where: { email: req.body.email } })]).then(([findAccount, findEmail]) => {
      if (findAccount) throw new Error('Account has already been taken.')
      if (findEmail) throw new Error('Email has already been taken.')
      const hash = bcrypt.hashSync(req.body.password, 10)
      const user = User.create({ // 上面錯誤狀況都沒發生，就把使用者的資料寫入資料庫
        name: req.body.name,
        account: req.body.account,
        email: req.body.email,
        password: hash,
        role: 'user'
      })
      return user
    })
      .then(user => {
        user = user.toJSON()
        delete user.password
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
    delete req.user.password
    const currentUser = res.json(req.user)
    return currentUser
  },
  getTopUsers: (req, res, next) => {
    return User.findAll({
      include: [{
        model: User, as: 'Followers'
      }],
      where: { role: 'user' }
    })
      .then(users => {
        users = users.map(u => ({
          ...u.dataValues,
          followerCount: u.Followers.length,
          isFollowing: req.user && req.user.Followers.map(f => f.id).includes(u.id)
        }))
        users.sort((a, b) => b.followerCount - a.followerCount)
        users = users.slice(0, 10)
        res.json(users)
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    if (Number(req.params.id) !== Number(req.user.id)) {
      throw new Error("User doen't have permission!")
    }
    const introduction = req.body.introduction || req.user.introduction || ''
    const password = req.body.password || req.user.password || '12345678'
    const name = req.body.name || req.user.name || 'name'
    const account = req.body.account || req.user.account || 'account'
    const email = req.body.email || req.user.email || 'email@email.com'
    const hash = bcrypt.hashSync(password, 10)
    let avatar = req.files?.avatar || null
    let cover = req.files?.cover || null
    console.log(req.body.introduction, req.user.introduction)
    Promise.all([User.findOne({ where: { email } }, { raw: true, nest: true }), User.findOne({ where: { account } }, { raw: true }), User.findByPk(req.params.id)])
      .then(([findEmail, findAccount, user]) => {
        if (findEmail && findEmail.id !== req.user.id) throw new Error('Email has already been taken.')
        if (findAccount && findAccount.id !== req.user.id) throw new Error('Account has already been taken.')
        if (avatar) avatar = imgurFileHandler(avatar[0])
        if (cover) cover = imgurFileHandler(cover[0])
        return user.update({
          name, account, email, password: hash, avatar: avatar || null, cover: cover || null, introduction
        })
      })
      .then(user => {
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
      where: { UserId: req.params.id },
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
      where: { UserId: req.params.id },
      include: [{
        model: Tweet,
        as: 'Tweet',
        attributes: ['UserId'],
        include: [{
          model: User,
          as: 'LikedUsers',
          attributes: ['account']
        }]
      }],
      order: [['createdAt', 'DESC']]
    })
      .then(replies => {
        if (!replies) throw new Error('This account does not exist.')
        const resultReplies = replies.map(r => ({ ...r.toJSON() }))
        return res.json({
          status: 'success',
          data: {
            replies: resultReplies
          }
        })
      }).catch(err => next(err))
  },
  getLikes: (req, res, next) => {
    return Like.findAll({
      where: { UserId: req.params.id },
      include: [{
        model: Tweet,
        as: 'Tweet',
        attributes: ['description'],
        include: [{
          model: Reply,
          as: 'Replies',
          attributes: ['id']
        }, {
          model: Like,
          as: 'Likes',
          attributes: ['id']
        }, {
          model: User,
          attributes: ['id', 'account', 'name', 'avatar']
        }]
      }],
      order: [['createdAt', 'DESC']]
    })
      .then(likes => {
        if (!likes) throw new Error('This account does not exist.')
        const resultLikes = likes.map(l => ({ ...l.toJSON(), replyCount: l.Tweet.Replies.length, likeCount: l.Tweet.Likes.length }))
        return res.json({
          status: 'success',
          data: {
            tweets: resultLikes
          }
        })
      }).catch(err => next(err))
  },
  getFollowings: (req, res, next) => {
    return User.findAll({
      where: { id: req.params.id },
      include: [
        { model: User, as: 'Followings', attributes: ['id', 'account', 'avatar', 'name', 'introduction'] }
      ],
      order: [['createdAt', 'DESC']]
    }).then(followings => {
      const resultFollowings = followings.map(f => ({ ...f.toJSON() }))
      delete resultFollowings[0].password
      return res.json({
        status: 'success',
        data: {
          user: resultFollowings
        }
      })
    }).catch(err => next(err))
  },
  getFollowers: (req, res, next) => {
    return User.findAll({
      where: { id: req.params.id },
      include: [
        { model: User, as: 'Followers', attributes: ['id', 'account', 'avatar', 'name', 'introduction'] }
      ],
      order: [['createdAt', 'DESC']]
    }).then(followers => {
      const resultFollowers = followers.map(f => ({ ...f.toJSON() }))
      delete resultFollowers[0].password
      return res.json({
        status: 'success',
        data: {
          user: resultFollowers
        }
      })
    }).catch(err => next(err))
  }
}
module.exports = userController

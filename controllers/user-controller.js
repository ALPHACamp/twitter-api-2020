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
    const currentUser = req.user
    delete currentUser.password
    return res.json({
      currentUser,
      tweetCount: currentUser.Tweets.length
    })
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
          isFollowed: req.user && req.user.Followings.map(f => f.id).includes(u.id)
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
    const password = req.body.password ? bcrypt.hashSync(req.body.password, 10) : req.user.password || bcrypt.hashSync('12345678', 10)
    const name = req.body.name || req.user.name || 'name'
    const account = req.body.account || req.user.account || 'account'
    const email = req.body.email || req.user.email || 'email@email.com'
    const avatar = req.files.avatar ? req.files.avatar[0] : null
    const cover = req.files.cover ? req.files.cover[0] : null
    Promise.all([User.findOne({ where: { email } }), User.findOne({ where: { account } }), User.findByPk(req.params.id), imgurFileHandler(avatar), imgurFileHandler(cover)])
      .then(([
        findEmail,
        findAccount,
        user,
        avatarFilePath,
        coverFilePath
      ]) => {
        if (findEmail && findEmail.id !== req.user.id) throw new Error('Email has already been taken.')
        if (findAccount && findAccount.id !== req.user.id) throw new Error('Account has already been taken.')
        return user.update({
          name, account, email, password, avatar: avatarFilePath, cover: coverFilePath, introduction
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
        const likedTweetId = req.user?.LikedTweets ? req.user.LikedTweets.map(likeTweet => likeTweet.id) : []
        const resultTweets = tweets.map(t => ({ ...t.toJSON(), Replies: t.Replies.length, Likes: t.Likes.length, isLiked: likedTweetId.includes(t.id) }))
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
        attributes: ['id'],
        include: [{
          model: User
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
    Promise.all([Like.findAll({
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
    }), User.findByPk(req.params.id)])
      .then(([likes, user]) => {
        if (!user) throw new Error('This account does not exist.')
        if (!likes) throw new Error('This account does not exist.')
        const tweets = likes.map(l => ({ ...l.toJSON(), ReplyCount: l.Tweet.Replies.length, LikeCount: l.Tweet.Likes.length, isLiked: true }))
        return res.json({
          status: 'success',
          data: {
            tweets
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

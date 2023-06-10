const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { User, Tweet, Reply, Like } = require('../models')
const userServices = {
  signUp: (req, cb) => {
    const { name, account, email, password, checkPassword } = req.body
    // check if password equals checkPassword
    if (password !== checkPassword) throw new Error('第二次輸入密碼有誤')
    Promise.all([
      User.findOne({ where: { account } }),
      User.findOne({ where: { email } })
    ])
      .then(([user1, user2]) => {
        if (user1) {
          throw new Error('account 已重複註冊！')
        }
        if (user2) {
          throw new Error('email 已重複註冊！')
        }
        return bcrypt.hash(password, 10)
      })
      .then(hash => {
        return User.create({
          name,
          account,
          email,
          password: hash,
          role: 'user'
        })
      })
      .then(() => cb(null))
      .catch(err => cb(err))
  },
  getUser: (req, cb) => {
    return User.findByPk(req.params.id, {
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ],
      nest: true
    })
      .then(user => {
        if (!user) throw new Error('使用者不存在')
        const data = {
          ...user.toJSON(),
          Follower_count: user.Followers.length,
          Following_count: user.Followers.length,
          isFollowed: user.Followers.some(f => f.id === req.user.id)
        }
        delete data.password
        delete data.role
        delete data.createdAt
        delete data.updatedAt
        delete data.Followers
        delete data.Followings
        return cb(null, data)
      })
      .catch(err => cb(err))
  },
  getUserTweets: (req, cb) => {
    return Tweet.findAll({
      where: { UserId: req.params.id },
      order: [['createdAt', 'DESC']],
      include: [User, Reply, Like],
    })
      .then(tweets => {
        tweets = tweets.map(tweet => {
          tweet = {
            ...tweet.toJSON(),
            isLiked: tweet.Likes.map(like => like.UserId).includes(req.user.id),
            replyCount: tweet.Replies.length,
            likedCount: tweet.Likes.length,
            name: tweet.User.name,
            avatar: tweet.User.avatar,
            account: tweet.User.account,
          }
          delete tweet.Replies
          delete tweet.Likes
          delete tweet.User
          return tweet
        })
        return cb(null, tweets)
      })
      .catch(err => cb(err))
  },
  getUserRepliedTweets: (req, cb) => {
    return Reply.findAll({
      where: { UserId: req.params.id },
      order: [['createdAt', 'DESC']],
      include: [User, Tweet]
    })
      .then(replies => {
        replies = replies.map(reply => {
          reply = {
            ...reply.toJSON(),
            name: reply.User.name,
            avatar: reply.User.avatar,
            account: reply.User.account,
          }
          delete reply.User
          delete reply.Replies
          delete reply.Likes
          return reply
        })
        return cb(null, replies)
      })
      .catch(err => cb(err))
  },
  putUser: (req, cb) => {
    try {
      const { name, introduction } = req.body
      const { files } = req
      if (introduction.length > 160) throw new Error('自我介紹字數超出上限160字！')
      if (name.length > 50) throw new Error('暱稱字數超出上限50字！')
      return User.findByPk(req.params.id)
        .then(user => {
          if (JSON.stringify(files) !== '{}' && files !== undefined) {
            return Promise.all([
              imgurFileHandler(files.coverPhoto[0]),
              imgurFileHandler(files.avatar[0])
            ])
              .then(([coverFilePath, avatarFilePath]) => {
                return user.update({
                  name,
                  avatar: avatarFilePath || user.avatar,
                  coverPhoto: coverFilePath || user.coverPhoto,
                  introduction
                })
              })
          } else {
            return user.update({
              name,
              introduction
            })
          }
        })
        .then(updatedUser => {
          cb(null, {
            status: 'success',
            message: '操作成功',
            data: {
              avatar: updatedUser.avatar,
              coverPhoto: updatedUser.coverPhoto,
              name: updatedUser.name,
              introduction: updatedUser.introduction
            }
          })
        })
    } catch (err) {
      cb(err)
    }
  },
  putAccount: (req, cb) => {
    const { name, account, email, password, checkPassword } = req.body
    if (password !== checkPassword) throw new Error('第二次輸入密碼有誤')
    if (name.length > 50) throw new Error('暱稱字數超出上限50字！')
    return User.findAll({
      where: {
        [Op.or]: [
          { email },
          { account }
        ]
      },
      attributes: ['account', 'email', 'id'],
      raw: true,
      nest: true
    })
      .then(user => {
        // check if email or account already used by user other than login user
        if (user.some(u => u.email === email && u.id !== req.user.id)) throw new Error('信箱已被註冊')
        if (user.some(u => u.account === account && u.id !== req.user.id)) throw new Error('帳號已被註冊')
        return User.findByPk(req.params.id)
      })
      .then(user => {
        return user.update({
          name,
          account,
          email,
          password: bcrypt.hashSync(password, 10)
        })
      })
      .then(() => {
        cb(null, {
          status: 'success',
          message: '操作成功'
        })
      })
      .catch(err => cb(err))
  },
  getFollowers: (req, cb) => {
    return User.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'Followers',
        attributes: ['id', 'name', 'avatar', 'introduction']
      }],
      raw: true,
      nest: true
    })
      .then(users => {
        console.log(users)
      })
  }
}

module.exports = userServices

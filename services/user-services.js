const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')

const { User, Followship, Tweet, Reply, Like } = require('../models')
const { getUser } = require('../_helpers')
const { imgurFileHandler } = require('../file-helper')

const userServices = {
  postUser: (req, cb) => {
    return User.findOne({
      where: {
        [Op.or]: [
          { email: req.body.email },
          { account: req.body.account }
        ]
      },
      raw: true,
      nest: true
    })
      .then(user => {
        if (user) {
          if (user.email === req.body.email) {
            throw new Error('信箱已被註冊過')
          } else {
            throw new Error('帳號已被註冊過')
          }
        }
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
        delete user.dataValues.password
        return cb(null, { user })
      })
      .catch(err => cb(err))
  },
  userLogin: (req, cb) => {
    const userData = getUser(req).toJSON()
    delete userData.password
    try {
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      return cb(null, { token, userData })
    } catch (err) {
      cb(err)
    }
  },
  getUserProfile: (req, cb) => {
    const id = req.params.id || getUser(req).dataValues.id
    return Promise.all([
      User.findByPk(id, {
        raw: true,
        nest: true
      }),
      Followship.findAll({
        where: { followerId: id },
        raw: true,
        nest: true
      }),
      Followship.findAll({
        where: { followingId: id },
        raw: true,
        nest: true
      })
    ])
      .then(([user, follower, following]) => {
        if (!user) throw new Error('資料庫內找不到使用者資料')
        // 瀏覽特定使用者資料時，特定使用者不包含後台管理員
        if (req.params.id && user.role === 'admin') throw new Error('帳號不存在')
        const data = {
          id: user.id,
          email: user.email,
          account: user.account,
          name: user.name,
          cover: user.cover,
          avatar: user.avatar,
          introduction: user.introduction,
          role: user.role,
          follower: follower.length,
          following: following.length
        }
        return cb(null, data)
      })
      .catch(err => cb(err))
  },
  getUserTweet: (req, cb) => {
    const { id } = req.params
    return Promise.all([
      Tweet.findAll({
        where: { userId: id },
        include: [Reply, Like],
        order: [['createdAt', 'DESC']]
      }),
      User.findByPk(id, {
        raw: true,
        nest: true
      })
    ])
      .then(([tweets, user]) => {
        if (!tweets) throw new Error('資料庫內找不到使用者資料')
        const data = tweets.map(t => ({
          id: t.dataValues.id,
          userData: {
            id: user.id,
            account: user.account,
            name: user.name,
            avatar: user.avatar
          },
          description: t.dataValues.description,
          replyAmount: t.Replies.length,
          likeAmount: t.Likes.length,
          createdAt: t.dataValues.createdAt
        }))
        return cb(null, data)
      })
      .catch(err => cb(err))
  },
  getUserReply: (req, cb) => {
    return Reply.findAll({
      where: { userId: req.params.id },
      include: [
        { model: User },
        { model: Tweet, include: User }
      ],
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(replies => {
        if (!replies.length) throw new Error('資料庫內找不到使用者資料')
        const data = replies.map(r => ({
          id: r.id,
          comment: r.comment,
          replierData: {
            id: r.User.id,
            account: r.User.account,
            name: r.User.name,
            avatar: r.User.avatar
          },
          tweetId: r.tweetId,
          tweetOwnerId: r.Tweet.userId,
          tweetOwnerAccount: r.Tweet.User.account,
          createdAt: r.createdAt
        }))
        return cb(null, data)
      })
      .catch(err => cb(err))
  },
  getUserFollowing: (req, cb) => {
    return Promise.all([
      User.findByPk(req.params.id, {
        include: { model: User, as: 'Followings' }
      }),
      Followship.findAll({
        where: { followerId: getUser(req).dataValues.id },
        raw: true
      })
    ])
      .then(([user, following]) => {
        if (!user) throw new Error('資料庫內找不到使用者資料')

        const currentUserFollowing = following.map(f => f.followingId)
        const data = user.Followings.map(f => ({
          followingId: f.id,
          account: f.account,
          email: f.email,
          name: f.name,
          avatar: f.avatar,
          introduction: f.introduction,
          followed: currentUserFollowing?.some(id => id === f.id)
        }))
        return cb(null, data)
      })
      .catch(err => cb(err))
  },
  getUserFollower: (req, cb) => {
    return Promise.all([
      User.findByPk(req.params.id, {
        include: { model: User, as: 'Followers' }
      }),
      Followship.findAll({
        where: { followerId: getUser(req).dataValues.id },
        raw: true
      })
    ])
      .then(([user, following]) => {
        if (!user) throw new Error('資料庫內找不到使用者資料')

        const currentUserFollowing = following.map(f => f.followingId)
        const data = user.Followers.map(f => ({
          followerId: f.id,
          account: f.account,
          email: f.email,
          name: f.name,
          avatar: f.avatar,
          introduction: f.introduction,
          followed: currentUserFollowing?.some(id => id === f.id)
        }))
        return cb(null, data)
      })
      .catch(err => cb(err))
  },
  putUserProfile: (req, cb) => {
    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error('資料庫內找不到使用者資料')
        const { files } = req
        // 有上傳封面或頭像
        if (JSON.stringify(files) !== '{}' && files !== undefined) {
          return Promise.all([
            imgurFileHandler(files.cover),
            imgurFileHandler(files.avatar)
          ])
            .then(([coverFilePath, avatarFilePath]) => {
              return user.update({
                name: req.body.name,
                introduction: req.body.introduction,
                cover: coverFilePath || user.toJSON().cover,
                avatar: avatarFilePath || user.toJSON().avatar
              })
            })
        } else {
          return user.update({
            name: req.body.name,
            introduction: req.body.introduction
          })
        }
      })
      .then(updatedUser => cb(null, updatedUser))
      .catch(err => cb(err))
  },
  putUserAccount: (req, cb) => {
    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error('資料庫內找不到使用者資料')

        return user.update({
          name: req.body.name,
          account: req.body.account,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, 10)
        })
      })
      .then(updatedUser => cb(null, updatedUser))
      .catch(err => cb(err))
  }
}

module.exports = userServices

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const helpers = require('../_helpers.js')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like

const userController = {
  register: (req, res) => {
    if (!req.body.name || !req.body.account || !req.body.email || !req.body.password || !req.body.checkPassword) {
      return res.json({ status: 'error', message: 'All fields must be filled.' })
    } else if (req.body.password !== req.body.checkPassword) {
      return res.json({ status: 'error', message: 'Password and check password must be the same.' })
    }
    User.findOne({ where: { $or: [{ email: req.body.email }, { account: req.body.account }] } })
      .then(user => {
        if (user) {
          if (user.email === req.body.email) {
            return res.json({ status: 'error', message: 'Email has been registered.' })
          } else if (user.account === req.body.account) {
            return res.json({ status: 'error', message: 'Already have the same account.' })
          }
        } else {
          User.create({
            name: req.body.name,
            account: req.body.account,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
            role: 'user'
          })
            .then(user => {
              return res.json({ status: 'success', message: 'Registration success.' })
            })
            .catch(error => res.send(String(error)))
        }
      })
      .catch(error => res.send(String(error)))
  },
  login: (req, res) => {
    if (!req.body.email || !req.body.password) {
      return res.json({ status: 'error', message: 'Please fill in the email and password.' })
    }
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (!user) {
          return res.json({ status: 'error', message: 'Email could not be found.' })
        }
        if (!bcrypt.compareSync(req.body.password, user.password)) {
          return res.json({ status: 'error', message: 'Email or password entered incorrectly.' })
        }
        const payload = { id: user.id }
        const token = jwt.sign(payload, process.env.JWT_SECRET)
        return res.json({
          status: 'success',
          message: 'welcome twitter',
          token,
          user: { id: user.id, name: user.name, email: user.email, role: user.role }
        })
      })
      .catch(error => res.send(String(error)))
  },
  getTweets: (req, res) => {
    Tweet.findAll({
      where: { UserId: req.params.id },
      include: [Reply, Like, User],
      order: [['createdAt', 'DESC']]
    })
      .then(tweet => {
        const tweetArray = tweet.map(t => ({
          ...t.dataValues,
          isLiked: t.Likes.map(l => l.UserId).includes(helpers.getUser(req).id)
        }))
        res.json(tweetArray)
      })
      .catch(error => res.send(String(error)))
  },

  getReplies: (req, res) => {
    Reply.findAll({
      where: { UserId: req.params.id },
      include: [{ model: Tweet, include: [Reply, User, Like] }],
      order: [['createdAt', 'DESC']]
    })
      .then(reply => {
        const set = new Set()
        const array = []
        reply.forEach(r => {
          if (!set.has(r.TweetId)) {
            set.add(r.TweetId)
            array.push(r)
          }
        })
        const replyArray = array.map(r => ({
          ...r.dataValues,
          isLiked: r.Tweet.Likes.map(l => l.UserId).includes(helpers.getUser(req).id)
        }))
        res.json(replyArray)
      })
      .catch(error => res.send(String(error)))
  },

  getLikes: (req, res) => {
    Like.findAll({
      where: { UserId: req.params.id },
      include: [{ model: Tweet, include: [Reply, User, Like] }],
      order: [['createdAt', 'DESC']]
    })
      .then(like => {
        const likeArray = like.map(l => ({
          ...l.dataValues,
          isLiked: l.Tweet.Likes.map(l => l.UserId).includes(helpers.getUser(req).id)
        }))
        res.json(likeArray)
      })
      .catch(error => res.send(String(error)))
  },

  getfollowings: (req, res) => {
    User.findByPk(req.params.id, { include: [{ model: User, as: 'Followings' }] })
      .then(user => {
        const FollowingArray = user.Followings.map(f => ({
          ...f.dataValues,
          followingId: f.dataValues.id,
          isFollowed: helpers.getUser(req).Followings.map(user => user.id).includes(f.id)
        }))
        res.json(FollowingArray)
      })
      .catch(error => res.send(String(error)))
  },

  getfollowers: (req, res) => {
    User.findByPk(req.params.id, { include: [{ model: User, as: 'Followers' }] })
      .then(user => {
        const FollowerArray = user.Followers.map(f => ({
          ...f.dataValues,
          followerId: f.dataValues.id,
          isFollowed: helpers.getUser(req).Followings.map(user => user.id).includes(f.id)
        }))
        res.json(FollowerArray)
      })
      .catch(error => res.send(String(error)))
  },

  getUser: (req, res) => {
    User.findByPk(req.params.id, { include: [{ model: User, as: 'Followers' }, { model: User, as: 'Followings' }] })
      .then(user => {
        user = {
          ...user.dataValues,
          isMyself: (user.id === helpers.getUser(req).id) ? true : false,
          isFollowed: helpers.getUser(req).Followings.map(user => user.id).includes(user.id)
        }
        res.json(user)
      })
      .catch(error => res.send(String(error)))
  },

  putUser: (req, res) => {
    if (Number(req.params.id) !== helpers.getUser(req).id) {
      return res.json({ status: 'error', message: 'permission denied' })
    }
    //編輯個人資料
    if (req.files) {
      if (!req.body.name) {
        return res.json({ status: 'error', message: 'Name must be filled in.' })
      }
      if (req.files.avatar) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(req.files.avatar[0].path, (err, img) => {
          User.findByPk(req.params.id)
            .then(user => {
              user.update({
                name: req.body.name,
                introduction: req.body.introduction,
                cover: user.cover,
                avatar: req.files.avatar[0] ? img.data.link : null
              })
                .then(user => {
                  return res.json({ status: 'success', message: 'Profile edited.' })
                })
                .catch(error => res.send(String(error)))
            })
            .catch(error => res.send(String(error)))
        })
      }
      if (req.files.cover) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(req.files.cover[0].path, (err, img) => {
          User.findByPk(req.params.id)
            .then(user => {
              user.update({
                name: req.body.name,
                introduction: req.body.introduction,
                avatar: user.avatar,
                cover: req.files.cover[0] ? img.data.link : null
              })
                .then(user => {
                  return res.json({ status: 'success', message: 'Profile edited.' })
                })
                .catch(error => res.send(String(error)))
            })
            .catch(error => res.send(String(error)))
        })
      }
      if (req.body.name) {
        User.findByPk(req.params.id)
          .then(user => {
            user.update({
              name: req.body.name
            })
              .then(user => {
                return res.json({ status: 'success', message: 'Profile edited.' })
              })
              .catch(error => res.send(String(error)))
          })
          .catch(error => res.send(String(error)))
      }
    } else {
      //帳戶設定
      if (req.body.account && req.body.name && req.body.email && req.body.password && req.body.confirmPassword) {
        if (req.body.password !== req.body.confirmPassword) {
          return res.json({ status: 'error', message: 'Password and confirm password must be the same.' })
        } else {
          User.findByPk(req.params.id)
            .then(user => {
              user.update({
                account: req.body.account,
                name: req.body.name,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
              })
                .then(user => {
                  return res.json({ status: 'success', message: 'Account settings have been updated.' })
                })
                .catch(error => res.send(String(error)))
            })
            .catch(error => res.send(String(error)))
        }
      } else if (!req.body.account || !req.body.name || !req.body.email) {
        return res.json({ status: 'error', message: 'Must fill in except the password' })
      } else {
        User.findByPk(req.params.id)
          .then(user => {
            user.update({
              account: req.body.account,
              name: req.body.name,
              email: req.body.email
            })
              .then(user => {
                return res.json({ status: 'success', message: 'Account settings have been updated.' })
              })
              .catch(error => res.send(String(error)))
          })
          .catch(error => res.send(String(error)))
      }
    }

  }
}

module.exports = userController
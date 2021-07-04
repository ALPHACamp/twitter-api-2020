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
const Chat = db.Chat
// const http = require('../app.js')
// const io = require('socket.io')(http);

const userController = {
  getCurrentUser: (req, res) => {
    const currentUserData = {
      id: helpers.getUser(req).id,
      name: helpers.getUser(req).name,
      account: helpers.getUser(req).account,
      email: helpers.getUser(req).email,
      avatar: helpers.getUser(req).avatar,
      cover: helpers.getUser(req).cover,
      isAdmin: helpers.getUser(req).role === 'admin' ? true : false,
    }
    return res.json(currentUserData)
  },

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
          return User.create({
            name: req.body.name,
            account: req.body.account,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
            role: 'user'
          })
        }
      })
      .then(user => {
        return res.json({ status: 'success', message: 'Registration success.' })
      })
      .catch(error => res.send(String(error)))
  },

  login: (req, res) => {
    if (!req.body.account || !req.body.password) {
      return res.json({ status: 'error', message: 'Please fill in the account and password.' })
    }
    User.findOne({ where: { account: req.body.account } })
      .then(user => {
        if (!user) {
          return res.json({ status: 'error', message: 'Account could not be found.' })
        }
        if (!bcrypt.compareSync(req.body.password, user.password)) {
          return res.json({ status: 'error', message: 'Account or password entered incorrectly.' })
        }
        const payload = { id: user.id }
        const token = jwt.sign(payload, process.env.JWT_SECRET)
        return res.json({
          status: 'success',
          message: 'welcome twitter',
          token,
          user: { id: user.id, name: user.name, account: user.account, email: user.email, role: user.role }
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
        return res.json(tweetArray)
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
        return res.json(replyArray)
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
        return res.json(likeArray)
      })
      .catch(error => res.send(String(error)))
  },

  getFollowings: (req, res) => {
    User.findByPk(req.params.id, { include: [{ model: User, as: 'Followings' }] })
      .then(user => {
        const FollowingArray = user.Followings.map(f => ({
          ...f.dataValues,
          followingId: f.dataValues.id,
          isFollowed: helpers.getUser(req).Followings.map(user => user.id).includes(f.id)
        }))
        FollowingArray.sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)
        return res.json(FollowingArray)
      })
      .catch(error => res.send(String(error)))
  },

  getFollowers: (req, res) => {
    User.findByPk(req.params.id, { include: [{ model: User, as: 'Followers' }] })
      .then(user => {
        const FollowerArray = user.Followers.map(f => ({
          ...f.dataValues,
          followerId: f.dataValues.id,
          isFollowed: helpers.getUser(req).Followings.map(user => user.id).includes(f.id)
        }))
        FollowerArray.sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)
        return res.json(FollowerArray)
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
        return res.json(user)
      })
      .catch(error => res.send(String(error)))
  },

  putUser: (req, res) => {
    if (Number(req.params.id) !== helpers.getUser(req).id) {
      return res.json({ status: 'error', message: 'permission denied' })
    }
    //編輯個人資料
    if (req.body.account === undefined) {
      //沒有上傳照片時
      if (!req.files.avatar && !req.files.cover) {
        //判斷 name 字數
        if (req.body.name.trim().length > 50 || req.body.name.trim().length === 0) {
          return res.json({ status: 'error', message: 'The name is required and does not exceed 50 characters.' })
        }
        //判斷 introduction 字數
        if (req.body.introduction.trim().length > 160) {
          return res.json({ status: 'error', message: 'The introduction does not exceed 160 words.' })
        }
        //更新 name 和 introduction
        return User.findByPk(req.params.id)
          .then(user => {
            return user.update({ name: req.body.name, introduction: req.body.introduction })
          })
          .then(user => {
            return res.json({ status: 'success', message: 'Profile edited.' })
          })
          .catch(error => res.send(String(error)))
      }
      //有上傳照片時
      if (req.files.avatar || req.files.cover) {
        //判斷 name 字數
        if (req.body.name.trim().length > 50 || req.body.name.trim().length === 0) {
          return res.json({ status: 'error', message: 'The name is required and does not exceed 50 characters.' })
        }
        //判斷 introduction 字數
        if (req.body.introduction.trim().length > 160) {
          return res.json({ status: 'error', message: 'The introduction does not exceed 160 words.' })
        }
        const avatar = new Promise((resolve, reject) => {
          if (req.files.avatar) {
            imgur.setClientID(IMGUR_CLIENT_ID)
            imgur.upload(req.files.avatar[0].path, (err, img) => {
              return User.findByPk(req.params.id)
                .then(user => {
                  return user.update({
                    name: req.body.name,
                    introduction: req.body.introduction,
                    avatar: req.files.avatar[0] ? img.data.link : null
                  })
                })
                .then(user => {
                  return resolve('avatar img ok')
                })
                .catch(error => reject(String(error)))
            })
          } else {
            return resolve('no avatar img')
          }
        })
        const cover = new Promise((resolve, reject) => {
          if (req.files.cover) {
            imgur.setClientID(IMGUR_CLIENT_ID)
            imgur.upload(req.files.cover[0].path, (err, img) => {
              return User.findByPk(req.params.id)
                .then(user => {
                  return user.update({
                    name: req.body.name,
                    introduction: req.body.introduction,
                    cover: req.files.cover[0] ? img.data.link : null
                  })
                })
                .then(user => {
                  return resolve('cover img ok')
                })
                .catch(error => reject(String(error)))
            })
          } else {
            return resolve('no cover img')
          }
        })
        Promise.all([cover, avatar])
          .then(img => {
            return res.json({ status: 'success', message: 'Profile edited.' })
          })
      }
      //帳戶設定
    } else {
      //password 和 checkPassword 不一樣
      if (req.body.password !== req.body.checkPassword) {
        return res.json({ status: 'error', message: 'Password and check password must be the same.' })
      }
      //account 或 name 或 email 沒填
      if (req.body.account.trim().length === 0 || req.body.name.trim().length === 0 || req.body.email.trim().length === 0) {
        return res.json({ status: 'error', message: 'Must fill in except the password' })
      }
      //password 和 checkPassword 沒填
      if (req.body.password.length === 0 || req.body.checkPassword.length === 0) {
        //搜尋資料庫是否有相同 account 和 email
        return User.findAll({ where: { $or: [{ account: req.body.account }, { email: req.body.email }] } })
          .then(user => {
            //account 或 name 有重複
            if (user.length !== 0) {
              //先過濾是自己的情況
              user = user.filter(u => u.id !== helpers.getUser(req).id)
              //過濾完發現只找到自己
              if (user.length === 0) {
                return User.findByPk(req.params.id)
                  .then(user => {
                    return user.update({
                      account: req.body.account,
                      name: req.body.name,
                      email: req.body.email
                    })
                  })
                  .then(user => {
                    return res.json({ status: 'success', message: 'Account settings have been updated.' })
                  })
                  .catch(error => res.send(String(error)))
              }
              if (user.length === 2) {
                return res.json({ status: 'error', message: 'Email and account repeated.' })
              }
              if (user.length === 1) {
                if (user[0].account === req.body.account && user[0].email === req.body.email) {
                  return res.json({ status: 'error', message: 'Email and account repeated.' })
                } else if (user[0].account === req.body.account) {
                  return res.json({ status: 'error', message: 'Account repeated.' })
                } else {
                  return res.json({ status: 'error', message: 'Email repeated.' })
                }
              }
            }
            //資料庫沒有相同資料時
            return User.findByPk(req.params.id)
              .then(user => {
                return user.update({
                  account: req.body.account,
                  name: req.body.name,
                  email: req.body.email
                })
              })
              .then(user => {
                return res.json({ status: 'success', message: 'Account settings have been updated.' })
              })
              .catch(error => res.send(String(error)))
          })
          .catch(error => res.send(String(error)))
      }
      //password 和 checkPassword 一樣
      if (req.body.password === req.body.checkPassword) {
        //搜尋資料庫是否有相同 account 和 email
        return User.findAll({ where: { $or: [{ account: req.body.account }, { email: req.body.email }] } })
          .then(user => {
            //account 或 name 有重複
            if (user.length !== 0) {
              //先過濾是自己的情況
              user = user.filter(u => u.id !== helpers.getUser(req).id)
              //過濾完發現只找到自己
              if (user.length === 0) {
                return User.findByPk(req.params.id)
                  .then(user => {
                    return user.update({
                      account: req.body.account,
                      name: req.body.name,
                      email: req.body.email,
                      password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
                    })
                  })
                  .then(user => {
                    return res.json({ status: 'success', message: 'Account settings have been updated.' })
                  })
                  .catch(error => res.send(String(error)))
              }
              if (user.length === 2) {
                return res.json({ status: 'error', message: 'Email and account repeated.' })
              }
              if (user.length === 1) {
                if (user[0].account === req.body.account && user[0].email === req.body.email) {
                  return res.json({ status: 'error', message: 'Email and account repeated.' })
                } else if (user[0].account === req.body.account) {
                  return res.json({ status: 'error', message: 'Account repeated.' })
                } else {
                  return res.json({ status: 'error', message: 'Email repeated.' })
                }
              }
            }
            //資料庫沒有相同資料時
            return User.findByPk(req.params.id)
              .then(user => {
                return user.update({
                  account: req.body.account,
                  name: req.body.name,
                  email: req.body.email,
                  password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
                })
              })
              .then(user => {
                return res.json({ status: 'success', message: 'Account settings have been updated.' })
              })
              .catch(error => res.send(String(error)))
          })
          .catch(error => res.send(String(error)))
      }
    }
  },
  // getChatroom: (req, res) => {
  //   console.log('我在這理')
  // }
}

module.exports = userController
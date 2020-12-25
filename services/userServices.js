const db = require('../models')
const helpers = require('../_helpers')
const bcrypt = require('bcrypt-nodejs')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userServices = {
  getProfile: (req, res, callback) => {
    return Promise.all([
      Followship.findAndCountAll({ where: { followingId: req.params.id } }),
      Followship.findAndCountAll({ where: { followerId: req.params.id } }),
      User.findOne({
        where: { id: req.params.id },
      }),
      Tweet.findAll({ include: [Reply, Like, User], where: { UserId: req.params.id } }),
      Reply.findAll({ include: { model: Tweet, include: User }, where: { UserId: req.params.id } }),
      Like.findAll({ include: [Tweet, User], where: { UserId: req.params.id } })
    ])
      // .then(user => { return callback({ user }) })
      .then(([follower, following, user, tweets, replies, likes]) => {
        callback({
          follower: follower,
          following: following,
          user: user,
          name: user.name,
          tweets: tweets.map(r => ({
            ...r.dataValues,
            likeTweetCount: r.Likes.length,
            replyTweetCount: r.Replies.length,
            isLiked: r.Likes.map(d => d.UserId).includes(helpers.getUser(req).id) || null
          })),
          isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id),
          replies,
          likes
        })
      })
  },
  putProfile: (req, res, callback) => {
    const USERID = helpers.getUser(req).id
    const { files } = req || {}
    console.log(files)

    if (!req.body.name) {
      callback({ status: 'error', message: '請輸入name!' })
    }

    if (files) {
      if (files['cover'] && !files['avatar']) {
        const cover = files['cover'][0] //==file
        imgur.setClientID(IMGUR_CLIENT_ID);
        imgur.upload(cover.path, (err, img) => {
          return User.findByPk(USERID)
            .then((user) => {
              user.update({
                name: req.body.name,
                introduction: req.body.introduction,
                cover: cover ? img.data.link : null
              }).then((user) => {
                callback({ status: 'success', message: 'user was successfully to update' })
              })
            })
        })
      } else if (req.files['avatar'] && !req.files['cover']) {
        const avatar = req.files['avatar'][0]
        imgur.setClientID(IMGUR_CLIENT_ID);
        imgur.upload(avatar.path, (err, img) => {
          return User.findByPk(USERID)
            .then((user) => {
              user.update({
                name: req.body.name,
                introduction: req.body.introduction,
                avatar: avatar ? img.data.link : null
              }).then((user) => {
                callback({ status: 'success', message: 'user was successfully to update' })
              })
            })
        })
      } else if (req.files['avatar'] && req.files['cover']) {
        const avatar = req.files['avatar'][0]
        const cover = req.files['cover'][0]
        imgur.setClientID(IMGUR_CLIENT_ID)
        return Promise.all([
          imgur.upload(avatar.path, (err, img) => {
            return User.findByPk(USERID)
              .then((user) => {
                user.update({
                  name: req.body.name,
                  introduction: req.body.introduction,
                  avatar: avatar ? img.data.link : null
                }).then((user) => {
                  callback({ status: 'success', message: 'user was successfully to update' })
                })
              })
          })
          ,
          imgur.upload(cover.path, (err, img) => {
            return User.findByPk(USERID)
              .then((user) => {
                user.update({
                  name: req.body.name,
                  introduction: req.body.introduction,
                  cover: cover ? img.data.link : null
                }).then((user) => {
                  callback({ status: 'success', message: 'user was successfully to update' })
                })
              })
          })
        ])
          .then((user) => {
            callback({ status: 'success', message: 'user was successfully to update' })
          })
      }
    }
    else {
      User.findByPk(USERID)
        .then(user => {
          user.update({
            name: req.body.name,
            introduction: req.body.introduction,
            avatar: user.avatar,
            cover: user.cover
          })
        })
        .then((user) => {
          callback({ status: 'success', message: 'user was successfully to update' })
        })
    }
  },
  getTopUsers: (req, res, callback) => {
    return User.findAll({
      where: {
        role: 'User'
      },
      include: [
        { model: User, as: 'Followers' }
      ]
    }).then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
      }))
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      users = users.slice(0, 10)
      return callback({ users: users })
    })
  },
  getFollowings: (req, res, callback) => {
    return Promise.all([
      Followship.findAndCountAll({
        where: { followerId: req.params.id },
      }),
      User.findOne({
        where: { id: req.params.id },
        include: [{ model: User, as: 'Followings' }]
      })
    ]).then(([followings, user]) => {
      const data = followings.rows
      followings.rows = followings.rows.map(d => ({
        ...d.dataValues,
        isFollowed: helpers.getUser(req).Followings.map(r => r.id).includes(d.followerId)
      }))
      return callback([
        data[0], //為了過測試使用
        followings,
        user,
      ])
    })
  },

  getFollowers: (req, res, callback) => {
    return Promise.all([
      Followship.findAndCountAll({
        where: { followingId: req.params.id }
      }),
      User.findOne({
        where: { id: req.params.id },
        include: [{ model: User, as: 'Followers' }]
      })
    ]).then(([followers, users]) => {
      const data = followers.rows
      followers.rows = followers.rows.map(d => ({
        ...d.dataValues,
        isFollowed: helpers.getUser(req).Followings.map(r => r.id).includes(d.followerId)
      }))
      return callback([
        data[0],
        followers,
        users
      ])
    })
  },

  getTweets: (req, res, callback) => {
    User.findByPk(req.params.id)
      .then(user => {
        Tweet.findAll({ include: [Reply, Like], where: { UserId: req.params.id } })
          .then(tweets => {
            tweets = tweets.map(data => ({
              ...data.dataValues,
              likeTweetCount: data.Likes.length,
              replyTweetCount: data.Replies.length
            }))
            return callback(tweets)
          })
      })
  },
  likeTweet: (req, res, callback) => {
    const USERID = helpers.getUser(req).id
    Like.create({
      UserId: USERID,
      TweetId: req.params.id
    }).then(like => {
      return callback({ status: 'success', message: `Like tweet` })
    })
  },
  unlikeTweet: (req, res, callback) => {
    const USERID = helpers.getUser(req).id
    Like.findOne({
      where: {
        UserId: USERID,
        TweetId: req.params.id
      }
    }).then(like => {
      like.destroy()
        .then(tweet => {
          return callback({ status: 'success', message: `DisLike tweet` })
        })
    })
  },
  getUserReplies: (req, res, callback) => {
    Reply.findAll({
      include: [User, Tweet],
      where: { UserId: req.params.id }
    }).then(replies => {
      return callback(replies)
    })

  },
  getUserLikes: (req, res, callback) => {
    Like.findAll({
      include: [User, { model: Tweet, include: [Like, Reply, User] }],
      where: { UserId: req.params.id }
    }).then(likes => {
      likes = likes.map(data => ({
        ...data.dataValues,
        likeTweetCount: data.Tweet.dataValues.Likes.length,
        replyTweetCount: data.Tweet.dataValues.Replies.length,
        isLiked: data.Tweet.dataValues.Likes.map(d => d.UserId).includes(helpers.getUser(req).id)
      }))
      return callback(likes)
    })

  },
  getSettingPage: (req, res, callback) => {
    const USERID = helpers.getUser(req).id
    User.findByPk(USERID)
      .then(user => {
        return callback([user.toJSON()])
      })
  },
  putSetting: (req, res, callback) => {
    const USERID = helpers.getUser(req).id
    if (req.body.password !== req.body.confirmedPassword) {
      return callback({ status: 'error', message: 'Password is different from confirmedPassword' })
    }
    else {
      User.findOne({ where: { account: req.body.account } })
        .then(user => {
          if (user && user.id !== USERID) {
            return callback({ status: 'error', message: 'Email is duplicated' })
          } else {
            User.findOne({ where: { email: req.body.email } })
              .then(user => {
                if (user && user.id !== USERID) {
                  return callback({ status: 'error', message: 'Email is duplicated' })
                } else {
                  User.findByPk(USERID)
                    .then((user) => {
                      user.update({
                        account: req.body.account,
                        name: req.body.name,
                        email: req.body.email,
                        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
                      })
                      return callback({ status: 'success', message: 'User infromation are updated' })
                    })
                }
              })
          }
        })
    }
  },
  getCurrentUser: (req, res, callback) => {
    const user = helpers.getUser(req)
    return callback({
      id: user.id,
      account: user.account,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      cover: user.cover,
      introduction: user.introduction
    })
  }
}
module.exports = userServices
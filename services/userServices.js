const db = require('../models')
const helpers = require('../_helpers')
const bcrypt = require('bcrypt-nodejs')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship
const Subscribe = db.Subscribe
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userServices = {
  getProfile: (req, res, callback) => {
    return Promise.all([
      Followship.findAndCountAll({ where: { followingId: req.params.id } }),
      Followship.findAndCountAll({ where: { followerId: req.params.id } }),
      User.findOne({
        where: { id: req.params.id }
      }),
      Tweet.findAll({ include: [Reply, Like, User], where: { UserId: req.params.id } }),
      Reply.findAll({ include: { model: Tweet, include: User }, where: { UserId: req.params.id } }),
      Like.findAll({ include: [Tweet, User], where: { UserId: req.params.id } }),
      Subscribe.findAndCountAll({ where: { subscriberId: req.params.id } })
    ])
      .then(([follower, following, user, tweets, replies, likes, subscribing]) => {
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
          isSubscribed: helpers.getUser(req).Subscribings.map(d => d.id).includes(user.id),
          replies,
          likes
        })
      })
  },
  putProfile: (req, res, callback) => {
    const USERID = helpers.getUser(req).id
    const { files } = req.files || {}

    if (!req.body.name) {
      callback({ status: 'error', message: '請輸入name!' })
    }

    if (files) {
      if (files.cover && !files.avatar) {
        const cover = files.cover[0]
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(cover.path, (err, img) => {
          if (err) {
            return
          }
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
      } else if (req.files.avatar && !req.files.cover) {
        const avatar = req.files.avatar[0]
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(avatar.path, (err, img) => {
          if (err) {
            return
          }
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
      } else if (req.files.avatar && req.files.cover) {
        const avatar = req.files.avatar[0]
        const cover = req.files.cover[0]
        imgur.setClientID(IMGUR_CLIENT_ID)
        return Promise.all([
          imgur.upload(avatar.path, (err, img) => {
            if (err) {
              return
            }
            return User.findByPk(USERID)
              .then((user) => {
                user.update({
                  name: req.body.name,
                  introduction: req.body.introduction,
                  avatar: avatar ? img.data.link : null
                })
              })
          }),
          imgur.upload(cover.path, (err, img) => {
            if (err) {
              return
            }
            return User.findByPk(USERID)
              .then((user) => {
                user.update({
                  name: req.body.name,
                  introduction: req.body.introduction,
                  cover: cover ? img.data.link : null
                })
              })
          })
        ])
          .then((user) => {
            callback({ status: 'success', message: 'user was successfully to update' })
          })
      }
    } else {
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
        role: 'user'
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
        where: { followerId: req.params.id }
      }),
      User.findOne({
        where: { id: req.params.id },
        include: [{ model: User, as: 'Followings' }]
      })
    ]).then(([followings, users]) => {
      followings = followings.rows.map(d => ({
        ...d.dataValues,
        isFollowed: helpers.getUser(req).Followings.map(r => r.id).includes(d.followingId)
      }))
      followings.forEach(following => {
        users.Followings.forEach(user => {
          if (user.id === following.followingId) {
            following.avatar = user.avatar
            following.id = user.id
            following.account = user.account
            following.introduction = user.introduction
            following.name = user.name
          }
        })
      })
      return callback(followings)
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
      followers.rows = followers.rows.map(d => ({
        ...d.dataValues,
        isFollowed: helpers.getUser(req).Followings.map(r => r.id).includes(d.followerId)
      }))
      followers.forEach(follower => {
        users.Followers.forEach(user => {
          if (user.id === follower.followerId) {
            follower.avatar = user.avatar
            follower.id = user.id
            follower.account = user.account
            follower.introduction = user.introduction
            follower.name = user.name
          }
        })
      })
      return callback(followers)
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
    const userId = helpers.getUser(req).id
    return Promise.all([
      Like.create({
        UserId: userId,
        TweetId: req.params.id
      }),
      Tweet.findOne({
        where: { id: req.params.id },
        include: [User]
      })
    ]).then(([like, tweet]) => {
      return callback({ status: 'success', message: 'Like tweet', tweet: tweet })
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
          return callback({ status: 'success', message: 'DisLike tweet' })
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
    } else {
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
  },
  getUsers: (req, res, callback, next) => {
    return User.findAll({ where: { role: 'user' } })
      .then(users => {
        const user = users.filter(user => user.dataValues.role !== 'admin')
        callback(user)
      })
  }
}
module.exports = userServices

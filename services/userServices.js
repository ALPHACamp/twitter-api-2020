const db = require('../models')
const helpers = require('../_helpers')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship
const fs = require('fs')

const userServices = {
  getProfile: (req, res, callback) => {
    const USERID = helpers.getUser(req).id
    return Promise.all([
      Followship.findAndCountAll({ where: { followerId: USERID } }),
      Followship.findAndCountAll({ where: { followingId: USERID } }),
      User.findOne({
        where: { id: USERID },
        include: [
          { model: Tweet, as: 'LikedTweets' }
        ]
      }),
      Tweet.findAll({ where: { UserId: USERID } })
    ])
      .then(([follower, following, user, tweets]) => {
        callback({
          follower: follower,
          following: following,
          user: user,
          tweets: tweets
        })
      })
  },
  putProfile: (req, res, callback) => {
    const USERID = helpers.getUser(req).id
    if (!req.body.name) {
      callback({ status: 'error', message: '請輸入name!' })
    }

    if (req.files) {
      if (req.files['cover'] && !req.files['avatar']) {
        const cover = req.files['cover'][0]

        fs.readFile(cover.path, (err, data) => {
          if (err) console.log('Error: ', err)
          fs.writeFile(`upload/${cover.originalname}`, data, () => {
            return User.findByPk(USERID)
              .then((user) => {
                user.update({
                  name: req.body.name,
                  introduction: req.body.introduction,
                  cover: cover ? `/upload/${cover.originalname}` : user.cover,
                }).then((user) => {
                  callback({ status: 'success', message: 'user was successfully to update' })
                })
              })
          })
        })
      } else if (req.files['avatar'] && !req.files['cover']) {
        const avatar = req.files['avatar'][0]

        fs.readFile(avatar.path, (err, data) => {
          if (err) console.log('Error: ', err)
          fs.writeFile(`upload/${avatar.originalname}`, data, () => {
            return User.findByPk(USERID)
              .then((user) => {
                user.update({
                  name: req.body.name,
                  introduction: req.body.introduction,
                  avatar: avatar ? `/upload/${avatar.originalname}` : user.avatar,
                }).then((user) => {
                  callback({ status: 'success', message: 'user was successfully to update' })
                })
              })
          })
        })
      } else if (req.files['avatar'] && req.files['cover']) {
        const avatar = req.files['avatar'][0]
        const cover = req.files['cover'][0]
        return Promise.all([
          fs.readFile(avatar.path, (err, data) => {
            if (err) console.log('Error: ', err)
            fs.writeFile(`upload/${avatar.originalname}`, data, () => {
              return User.findByPk(USERID)
                .then((user) => {
                  user.update({
                    name: req.body.name,
                    introduction: req.body.introduction,
                    avatar: avatar ? `/upload/${avatar.originalname}` : user.avatar,
                  })
                })
            })
          }),
          fs.readFile(cover.path, (err, data) => {
            if (err) console.log('Error: ', err)
            fs.writeFile(`upload/${cover.originalname}`, data, () => {
              return User.findByPk(USERID)
                .then((user) => {
                  user.update({
                    name: req.body.name,
                    introduction: req.body.introduction,
                    cover: cover ? `/upload/${cover.originalname}` : user.cover,
                  })
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
    const USERID = helpers.getUser(req).id
    User.findByPk(USERID, { include: [{ model: Tweet, as: 'RepliedTweets' }] })
      .then(user => {
        return callback({ user })
      })
  }
}
module.exports = userServices
const db = require('../models')
const helpers = require('../_helpers')
const bcrypt = require('bcrypt-nodejs')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like

const userServices = {
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
        return callback([user.toJSON()])
      })
  },
  getUserLikes: (req, res, callback) => {
    const USERID = helpers.getUser(req).id
    User.findByPk(USERID, { include: [{ model: Tweet, as: 'LikedTweets' }] })
      .then(user => {
        return callback([user.toJSON()])
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
      return User.findByPk(USERID)
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
  }
}
module.exports = userServices
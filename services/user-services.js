const bcrypt = require('bcryptjs')
const { User, Tweet, Reply, Followship } = require('../models')
const helpers = require('../_helpers')
const userServices = {
  signUp: (req, cb) => {
    const { account, name, email, password, checkPassword } = req.body
    if (password != checkPassword) throw new Error('Password do not match!')

    User.findOne({ where: { account } })
      .then(user => {
        if (user) throw new Error('Account already exists!')
        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({
        account,
        name,
        email,
        password: hash
      }))
      .then(createdUser => cb(null, { createdUser }))
      .catch(err => cb(err))
  },
  getUser: (req, cb) => {
    User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error("User didn't exists!")
        return user = user.get({ plain: true })
      })
      .then(user => cb(null, user))
      .catch(err => cb(err))
  },
  getUserTweets: (req, cb) => {
    return Promise.all([
      User.findByPk(req.params.id, { raw: true }),
      Tweet.findAll({
        raw: true,
        where: { UserId: req.params.id }
      })
    ])
      .then(([user, tweets]) => {
        if (!user) throw new Error("User didn't exists!")
        return cb(null, tweets)
      })
      .catch(err => cb(err))
  },
  getUserRepliedTweets: (req, cb) => {
    return Promise.all([
      User.findByPk(req.params.id, { raw: true }),
      Reply.findAll({
        raw: true,
        nest: true,
        where: { UserId: req.params.id },
        include: Tweet
      })
    ])
      .then(([user, replies]) => {
        if (!user) throw new Error("User didn't exists!")
        const repliedTweets = replies.map(r => ({
          ...r.Tweet,
          comment: r.comment
        }))
        return cb(null, repliedTweets)
      })
      .catch(err => cb(err))

  },
  addFollowing: (req, cb) => {
    return Promise.all([
      User.findByPk(req.body.id),
      Followship.findOne({
        where: {
          followerId: helpers.getUser(req).id,
          followingId: req.body.id
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error("User didn't exist!")
        if (followship) throw new Error('You are already following this user!')
        return Followship.create({
          followerId: helpers.getUser(req).id,
          followingId: req.body.id
        })
      })
      .then(addfollowing => cb(null, addfollowing))
      .catch(err => cb(err))
  },
  removeFollowing: (req, cb) => {
    Followship.findOne({
      where: {
        followerId: helpers.getUser(req).id,
        followingId: req.params.followingId
      }
    })
      .then(followship => {
        if (!followship) throw new Error("You haven't followed this user!")
        return followship.destroy()
      })
      .then(removefollowship => cb(null, removefollowship))
      .catch(err => cb(err))
  }
}
module.exports = userServices
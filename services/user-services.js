const bcrypt = require('bcryptjs')
const { User, Tweet, Reply, Like, Followship } = require('../models')
const { imgurHandler } = require('../_helpers')
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
      .then(user => cb(null, user ))
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
  getUserLikes: (req, cb) => {
    return Promise.all([
      User.findByPk(req.params.id, { raw: true }),
      Like.findAll({
        raw: true,
        nest: true,
        where: { UserId: req.params.id },
        include: [ Tweet ]
      })
    ])
    .then(([user, likes]) => {
      if (!user) throw new Error("User didn't exists!")
      const userLikes = likes.map(l => ({
        UserId: l.UserId,
        TweetId: l.TweetId,
        description: l.Tweet.description,
        createdAt: l.createdAt,
        updatedAt: l.updatedAt
      }))
      return cb(null, userLikes)
    })
    .catch(err => cb(err))
  },
  getUserFollowings: (req, cb) => {
    return Promise.all([
      User.findByPk(req.params.id),
      Followship.findAll({
        raw: true,
        where: { 
          followerId: req.params.id
        }
      })
    ])
    .then(([user, followings]) => {
      if (!user) throw new Error("User didn't exists!")
      return cb(null, followings)
    })
    .catch(err => cb(err))

  },
  getUserFollowers: (req, cb) => {
    return Promise.all([
      User.findByPk(req.params.id, {raw: true}),
      Followship.findAll({
        raw: true,
        where: {
          followingId: req.params.id
        }
      })
    ])
    .then(([user, followers]) => {
      if (!user) throw new Error("User didn't exists!")
      return cb(null, followers)
    })
    .catch(err => cb(err))
  },
  putUser: (req, cb) => {
    const { name, description, cover, avatar } = req.body

  }
}
module.exports = userServices
const bcrypt = require('bcryptjs')
const { User, Tweet, Reply, Like, Followship } = require('../models')
const helpers = require('../_helpers')
const userServices = {
  signUp: (req, cb) => {
    let { account, name, email, password, checkPassword } = req.body

    account = account.trim()
    name = name.trim()
    email = email.trim()
    password = password.trim()
    checkPassword = checkPassword.trim()

    if (password != checkPassword) throw new Error('Password do not match!')
    if (!account || !password || !checkPassword || !email) throw new Error('Please fill required fields!')
    if (name.length > 50) throw new Error('Length of the name is too long!')

    return Promise.all([
      User.findOne({ where: { account }}),
      User.findOne({ where: { email }})
    ])
      .then(([accountCheck, emailCheck]) => {
        if (accountCheck) throw new Error('Account already exists!')
        if (emailCheck) throw new Error('Email already exists!')
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
    return User.findByPk(req.params.id, {
      nest: true,
      include: [
        { model: User, as: 'Followers'},
        { model: User, as: 'Followings'}
      ]
    })
      .then(user => {
        if (!user) throw new Error("User didn't exists!")      
        const userData = user.toJSON()
        delete userData.password
        userData.Followers = userData.Followers.length
        userData.Followings = userData.Followings.length
        return cb(null, userData)
      })
      .catch(err => cb(err))
  },
  getUserTweets: (req, cb) => {
    return Promise.all([
      User.findByPk(req.params.id, { raw: true }),
      Tweet.findAll(
        {
        where: { UserId: req.params.id },
          include: [{model: User},{ model: Reply }, { model: Like}]
      })
    ])
      .then(([user, tweets]) => {
        if (!user) throw new Error("User didn't exists!")
        const tweetsData = tweets.map(t => ({
          ...t.toJSON(),
          userAccount: t.User.account,
          userAvatar: t.User.avatar,
          User: t.User.name,
          Replies:t.Replies.length,
          Likes: t.Likes.length
        }))
        return cb(null, tweetsData)
      })
      .catch(err => cb(err))
  },
  getUserRepliedTweets: (req, cb) => {
    return Promise.all([
      User.findByPk(req.params.id, { raw: true }),
      Reply.findAll({
        where: { UserId: req.params.id },
        include:[{model: Tweet, include: User}]
      })
    ])
      .then(([user, replies]) => {
        if (!user) throw new Error("User didn't exists!")
        const repliedTweets = replies.map(r => ({
          ...r.Tweet.toJSON(),
          User: r.Tweet.User.name, 
          userAvatar: r.Tweet.User.avatar,
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
        where: { UserId: req.params.id },
        include: [{ model: Tweet, include: [{model: User}, {model: Reply}, {model: Like}]}]
      })
    ])
    .then(([user, likes]) => {
      if (!user) throw new Error("User didn't exists!")
      const userLikes = likes.map(l => ({
        UserId: l.UserId,
        tweetName: l.Tweet.User.name,
        tweetAccount: l.Tweet.User.account,
        tweetAvatar: l.Tweet.User.avatar,
        TweetId: l.TweetId,
        tweetDescription: l.Tweet.description,
        tweetLikesCount: l.Tweet.Likes.length,
        tweetRepliesCount: l.Tweet.Replies.length,
        createdAt: l.createdAt,
        updatedAt: l.updatedAt
      }))
      return cb(null, userLikes)
    })
    .catch(err => cb(err))
  },
  getUserFollowings: (req, cb) => {
    return User.findByPk(req.params.id, {
      include: [
        { model: User, as: 'Followings' }
      ]
    })
      .then((user) => {
        const userFollowings = user.Followings.map(f => ({
          followingId: f.id,
          followingName: f.name,
          followingAccount: f.account,
          followingAvatar: f.avatar,
          followingIntroduction: f.introduction
        }))
        if (!user) throw new Error("User didn't exists!")
        return cb(null, userFollowings)
      })
      .catch(err => cb(err))
  },
  getUserFollowers: (req, cb) => {
    return User.findByPk(req.params.id, {
      include: [
        {model: User, as: 'Followers'}
      ]})
    .then((user) => {
      const userFollowers = user.Followers.map(f => ({
        followerId: f.id,
        followerName: f.name,
        followerAccount: f.account,
        followerAvatar: f.avatar,
        followerIntroduction: f.introduction
      }))
      if (!user) throw new Error("User didn't exists!")
      return cb(null, userFollowers)
    })
    .catch(err => cb(err))
  },
  putUser: (req, cb) => {
    const { name, introduction, cover, avatar } = req.body
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
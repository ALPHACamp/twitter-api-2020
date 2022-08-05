const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship
const bcrypt = require('bcryptjs')
// JWT
const jwt = require('jsonwebtoken')
// const passportJWT = require('passport-jwt')
// const ExtractJwt = passportJWT.ExtractJwt
// const JwtStrategy = passportJWT.Strategy

const userController = {
  signIn: (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
      return res.json({ ststus: 'error', message: '請輸入 email 與密碼' })
    }

    User.findOne({ where: { email: email } })
      .then(user => {
        if (!user) {
          return res.status(401).json({ ststus: 'error', message: '此 email 尚未註冊' })
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return res.status(401).json({ ststus: 'error', message: '密碼錯誤' })
        }

        // 簽發token
        let payload = { id: user.id }
        let token = jwt.sign(payload, process.env.JWT_SECRET)
        // 回傳訊息、token、user data
        return res.json({
          status: 'success',
          message: '登入驗證成功',
          token: token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            account: user.account,
            avatar: user.avatar,
            introduction: user.introduction,
            role: user.role,
            banner: user.banner,
          }
        })
      })
  },
  signUp: (req, res) => {
    const { account, name, email, password, checkPassword } = req.body

    if (!account || !name || !email || !password || !checkPassword) {
      return res.json({ status: 'error', message: 'account, name, email, password, checkPassword 均需填寫' })
    }

    if (password !== checkPassword) {
      return res.json({ status: 'error', message: 'password, checkPassword 不一致' })
    }

    User.findOne({ where: { email: email } })
      .then(user => {
        if (user) {
          return res.json({ status: 'error', message: 'email 已經註冊' })
        }
        User.create({
          account: account,
          name: name,
          email: email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
          role: 'user'
        })
          .then(user => {
            return res.json({ status: 'success', message: '' })
          })
      })
  },
  getUser: (req, res) => {
    User.findByPk(req.params.id, { include: [{ model: User, as: 'Followers' }, { model: User, as: 'Followings' }] })
      .then(user => {
        user = {
          account: user.account,
          avatar: user.avatar,
          id: user.id,
          email: user.email,
          introduction: user.introduction,
          name: user.name,
          role: user.role,
          banner: user.banner,
          Followers: user.Followers.map(follower => follower.Followship.followerId),
          Followings: user.Followings.map(following => following.Followship.followingId)
        }
        return res.json(user)
      })
  },
  getCurrentUser: (req, res) => {
    return res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      account: req.user.account,
      avatar: req.user.avatar,
      banner: req.user.banner,
      introduction: req.user.introduction,
      role: req.user.role,
      Followers: req.user.Followers,
      Followings: req.user.Followings
    })
  },
  getUserTweets: (req, res) => {
    const userId = req.params.id
    Tweet.findAll({ where: { UserId: userId }, include: [User, Like, Reply] })
      .then(tweets => {
        tweets = { tweets: tweets }
        tweets = JSON.stringify(tweets)
        tweets = JSON.parse(tweets)
        tweets = tweets.tweets.map(tweet => ({
          ...tweet,
          User: {
            account: tweet.User.account,
            avatar: tweet.User.avatar,
            id: tweet.User.id,
            introduction: tweet.User.introduction,
            name: tweet.User.name,
            role: tweet.User.role,
            banner: tweet.User.banner,
          }
        }))
        return res.json(tweets)
      })
  },
  getUserRepliedTweets: (req, res) => {
    const userId = req.params.id
    Reply.findAll({ where: { UserId: userId }, include: [User, { model: Tweet, include: [User] }], raw: true, nest: true })
      .then(replies => {
        replies = replies.map(reply => ({
          id: reply.id,
          UserId: reply.UserId,
          TweetId: reply.TweetId,
          comment: reply.comment,
          createdAt: reply.createdAt,
          updatedAt: reply.updatedAt,
          User: {
            account: reply.User.account,
            avatar: reply.User.avatar,
            id: reply.User.id,
            name: reply.User.name,
          },
          Tweet: {
            id: reply.Tweet.id,
            UserId: reply.Tweet.UserId,
            description: reply.Tweet.description,
            createdAt: reply.Tweet.createdAt,
            updatedAt: reply.Tweet.updatedAt,
            User: {
              account: reply.Tweet.User.account,
              avatar: reply.Tweet.User.avatar,
              id: reply.Tweet.User.id,
              name: reply.Tweet.User.name,
            }
          }
        }))
        return res.json(replies)
      })
  },
  getUserLikes: (req, res) => {
    const userId = req.params.id
    Like.findAll({ where: { UserId: userId }, include: [{ model: Tweet, include: [User, Reply, Like] }] })
      .then(likes => {
        likes = likes.map(like => ({
          id: like.id,
          UserId: like.UserId,
          TweetId: like.TweetId,
          createdAt: like.createdAt,
          updatedAt: like.updatedAt,
          Tweet: {
            id: like.Tweet.id,
            UserId: like.Tweet.UserId,
            description: like.Tweet.description,
            createdAt: like.Tweet.createdAt,
            updatedAt: like.Tweet.updatedAt,
            User: {
              id: like.Tweet.User.id,
              account: like.Tweet.User.account,
              avatar: like.Tweet.User.avatar,
              name: like.Tweet.User.name,
            },
            Replies: like.Tweet.Replies,
            Likes: like.Tweet.Likes,
          },
        }))
        return res.json(likes)
      })
  },
  getUserFollowings: (req, res) => {
    const userId = req.params.id
    Followship.findAll({ where: { followerId: userId } })
      .then(followings => {
        followings = { followings: followings }
        followings = JSON.stringify(followings)
        followings = JSON.parse(followings)
        followings = followings.followings.map(following => following)
        Promise.all(followings.map(following => {
          return User.findByPk(following.followingId)
        }))
          .then((users) => {
            users = { users: users }
            users = JSON.stringify(users)
            users = JSON.parse(users)
            users = users.users.map(user => ({
              account: user.account,
              avatar: user.avatar,
              id: user.id,
              introduction: user.introduction,
              name: user.name,
            }))
            followings.forEach((following, index) => {
              following.followingUser = users[index]
            })
            return res.json(followings)
          })
      })
  },
  getUserFollowers: (req, res) => {
    const userId = req.params.id
    Followship.findAll({ where: { followingId: userId } })
      .then(followers => {
        followers = { followers: followers }
        followers = JSON.stringify(followers)
        followers = JSON.parse(followers)
        followers = followers.followers.map(follower => follower)
        Promise.all(followers.map(follower => {
          return User.findByPk(follower.followerId)
        }))
          .then((users) => {
            users = { users: users }
            users = JSON.stringify(users)
            users = JSON.parse(users)
            users = users.users.map(user => ({
              account: user.account,
              avatar: user.avatar,
              id: user.id,
              introduction: user.introduction,
              name: user.name,
            }))
            followers.forEach((follower, index) => {
              follower.followerUser = users[index]
            })
            return res.json(followers)
          })
      })
  },
  putUser: (req, res) => {
    const { name, introduction, email, account, checkPassword } = req.body
    let { password } = req.body
    if (password !== checkPassword) {
      return res.json({ status: 'error', message: 'password, checkPassword 不一致' })
    }
    if (password) {
      password = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
    } else {
      password = ''
    }
    User.findByPk(req.params.id, { include: [{ model: User, as: 'Followers' }, { model: User, as: 'Followings' }] })
      .then(user => {
        user.update({
          name: name || user.name,
          introduction: introduction || user.introduction,
          email: email || user.email,
          account: account || user.account,
          password: password || user.password,
        })
          .then(user => {
            user = {
              account: user.account,
              avatar: user.avatar,
              id: user.id,
              email: user.email,
              introduction: user.introduction,
              name: user.name,
              role: user.role,
              banner: user.banner,
              Followers: user.Followers.map(follower => follower.Followship.followerId),
              Followings: user.Followings.map(following => following.Followship.followingId)
            }
            return res.json(user)
          })
      })
  }
}

module.exports = userController

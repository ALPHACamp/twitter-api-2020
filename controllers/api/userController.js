const db = require('../../models')
const { User, Tweet, Like, Reply, Followship } = db
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
const fs = require('fs')
const imgur = require('imgur')
const helpers = require('../../_helpers')

const userController = {
  signIn: (req, res) => {
    const { account, password } = req.body
    if (!account || !password) {
      return res.json({ status: 'error', message: "required fields didn't exist" })
    }
    User.findOne({ where: { account } }).then(user => {
      if (!user) return res.status(401).json({ status: 'error', message: 'no such user found' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: 'passwords did not match' })
      }
      if (user.role === 'admin') { return res.json({ status: 'error', message: "admin can't signin" }) }
      const { id, name, account, email, avatar, role } = user
      var payload = { id }
      var token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.json({
        status: 'success',
        message: 'ok',
        token,
        user: { id, name, account, email, avatar, role }
      })
    })
  },
  signUp: (req, res) => {
    const { account, name, email, password, passwordCheck } = req.body
    if (!account || !password || !name || !email || !passwordCheck) {
      return res.json({ status: 'error', message: "required fields didn't exist" })
    }
    User.findOne({ where: { email } }).then(user => {
      if (user) { return res.json({ status: 'error', message: "this email already exists " }) }
      if (password !== passwordCheck) {
        return res.json({ status: 'error', message: "password and passwordCheck didn't match" })
      }
      User.create({ account, name, email, password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null) })
        .then(() => res.json({ status: 'success', message: "signup successfully" }))
    })
  },
  getCurrentUser: (req, res) => {
    User.findByPk(helpers.getUser(req).id).then(user => {
      const { id, name, account, avatar, role } = user
      res.json({ id, name, account, avatar, role })
    })
  },
  editUser: (req, res) => {
    const { name, account, email, password, passwordCheck, cover, avatar, introduction } = req.body
    if (!account || !password || !name || !email || !passwordCheck) {
      return res.json({ status: 'error', message: "required fields didn't exist" })
    }
    if (password !== passwordCheck) {
      return res.json({ status: 'error', message: "password and passwordCheck didn't match" })
    }
    const { files } = req
    if (files) {
      console.log(files['cover'][0].path)//  確定程式跑到這都沒問題，可拿到 temp/0b4c8ff45edde0f788125b4db8078f6c
      imgur.setClientId(process.env.IMGUR_CLIENT_ID)
      imgur.uploadFile(files['cover'][0].path)
        .then((img) => {
          console.log(img.data.link)
          console.log(img.link)
          User.findByPk(helpers.getUser(req).id)
            .then(user => {
              user.cover = user.cover ? user.cover : null
              user.avatar = user.avatar ? user.avatar : null
              user.update({
                name, account, email, password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)), introduction,
                cover: files['cover'][0] ? img.link : user.cover,
                avatar: files['avatar'][0] ? img.link : user.avatar
              }).then(() => res.json({ status: 'success', message: "user profiles has updated!" }))
            })
        })
    } else {  // 以下程式也確認沒問題，可成功更新資料
      User.findByPk(helpers.getUser(req).id)
        .then(user => {
          user.update({
            name, account, email, password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)), introduction,
            cover: user.cover ? user.cover : null,
            avatar: user.avatar ? user.avatar : null
          }).then(() => res.json({ status: 'success', message: "user profiles has updated!" }))
        })
    }
  },
  getUser: (req, res) => { //取得任一使用者資料
    const id = req.params.id
    Promise.all([
      Tweet.count({ where: { UserId: id } }),
      User.findOne({
        where: { id },
        include: [{ model: User, as: 'Followers' }, { model: User, as: 'Followings' }]
      })
    ]).then(([tweets, user]) => {
      const tweetsNumber = tweets // 使用者推文數
      const { name, account, email, avatar, cover, introduction } = user.dataValues
      const followingsNumber = user.dataValues.Followings.length // 使用者追蹤數
      const followersNumber = user.dataValues.Followers.length// 使用者跟隨數
      const isFollowed = helpers.getUser(req).Followings.map(d => d.id).includes(user.id) // 我(helpers.getUser(req))的追蹤名單中是否有這位 user.id
      return res.json({ user: { id, name, account, email, avatar, cover, introduction, tweetsNumber, followingsNumber, followersNumber, isFollowed } })
    })
  },
  getUserTweets: (req, res) => {
    Tweet.findAll({ where: { UserId: req.params.id }, order: [['createdAt', 'DESC']], include: [Reply, User, { model: User, as: 'LikedUsers' }] })
      .then(t => {
        const tweets = []
        t.map(tweet => {
          const { id, description, createdAt, User, LikedUsers, Replies } = tweet.dataValues
          const likesNumber = LikedUsers.length   // 推文like數
          const repliesNumber = Replies.length  // 推文回覆數
          const isLiked = helpers.getUser(req).LikedTweets.map(d => d.id).includes(tweet.id) // 是否按過like
          tweets.push({ id, description, likesNumber, repliesNumber, isLiked, createdAt, User: { id: User.id, name: User.name, account: User.account, avatar: User.avatar } })
        })
        return res.json({ tweets })
      })
  },
  getUserReplies: (req, res) => {
    Reply.findAll({ where: { UserId: req.params.id }, order: [['createdAt', 'DESC']], include: [Tweet, { model: Tweet, include: [Reply, User, { model: User, as: 'LikedUsers' }] }] })
      .then(reply => {
        const replies = []
        reply.map(r => {
          const { id, description, createdAt, LikedUsers, Replies, User } = r.dataValues.Tweet
          const likesNumber = LikedUsers.length // 推文like數
          const repliesNumber = Replies.length  // 推文回覆數
          const isLiked = helpers.getUser(req).LikedTweets.map(d => d.id).includes(id) // 是否按過like
          const tweetData = { id, description, likesNumber, repliesNumber, isLiked, createdAt, User: { id: User.id, name: User.name, account: User.account, avatar: User.avatar } }
          replies.push(tweetData)
        })
        return res.json({ tweets: [replies] })
      })
  },
  addFollowing: (req, res) => {
    if (req.params.followingId == helpers.getUser(req).id) { return res.json({ status: 'error', message: "can't follow yourself!" }) }
    Followship.create({
      followerId: helpers.getUser(req).id,
      followingId: req.params.followingId
    }).then(() => res.json({ status: 'success', message: "create followship successfully!" }))
  },
  removeFollowing: (req, res) => {
    Followship.findOne({ where: { followerId: helpers.getUser(req).id, followingId: req.params.followingId } })
      .then(followship => {
        if (followship) {
          followship.destroy()
            .then(() => res.json({ status: 'success', message: "remove followship successfully!" }))
        }
        return res.json({ status: 'error', message: `have no followship with ${req.params.followingId}` })

      })
  },
  getUserFollowings: (req, res) => { // 取得 :userId 的追蹤者
    Promise.all([
      User.findOne({ where: { id: req.params.id }, include: [{ model: User, as: 'Followings' }] }),
      Tweet.count({ where: { UserId: req.params.id } })
    ]).then(([user, tweet]) => {
      const tweetsNumber = tweet   // 使用者推文數
      const { id, name, Followings } = user.dataValues
      const followings = []
      Followings.map(d =>
        followings.push({
          id: d.id,
          name: d.name,
          account: d.account,
          avatar: d.avatar,
          introduction: d.introduction,
          isFollowed: helpers.getUser(req).Followings.map(f => f.id).includes(d.id)
        })
      )
      return res.json({
        user: { id, name, tweetsNumber, followings }
      })
    })
  },
  getUserFollowers: (req, res) => {
    Promise.all([
      User.findOne({ where: { id: req.params.id }, include: [{ model: User, as: 'Followers' }] }),
      Tweet.count({ where: { UserId: req.params.id } })
    ]).then(([user, tweet]) => {
      console.log(user.Followers)
      const tweetsNumber = tweet  // 使用者推文數
      const { id, name, Followers } = user.dataValues
      const followers = []
      Followers.map(d =>
        followers.push({
          id: d.id,
          name: d.name,
          account: d.account,
          avatar: d.avatar,
          introduction: d.introduction,
          isFollowed: helpers.getUser(req).Followers.map(f => f.id).includes(d.id)
        })
      )
      return res.json({
        user: { id, name, tweetsNumber, followers }
      })
    })
  },
  getTopUsers: (req, res) => {
    User.findAll({ include: [{ model: User, as: 'Followers' }] })
      .then(users => {
        users = users.map(user => ({
          id: user.dataValues.id,
          name: user.dataValues.name,
          avatar: user.dataValues.avatar,
          account: user.dataValues.account,
          FollowerCount: user.Followers.length,
          isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.dataValues.id)
        }))
        users = users.sort((a, b) => b.FollowerCount - a.FollowerCount).slice(0, 10)
        return res.json({ users })
      })
  },
  getUserLikes: (req, res) => {
    Like.findAll({
      where: { UserId: req.params.id }, include: [Tweet, User, { model: Tweet, include: [Reply, User, { model: User, as: 'LikedUsers' }] }]
    })
      .then(async (likes) => {
        const tweets = []
        likes.map(like => {
          const { id, description, createdAt, LikedUsers, Replies, User } = like.dataValues.Tweet
          console.log(like.dataValues.Tweet)
          tweets.push({
            id,
            description,
            likesNumber: LikedUsers.length,
            repliesNumber: Replies.length,
            isLiked: helpers.getUser(req).LikedTweets.map(d => d.id).includes(id),
            createdAt,
            User: { id: User.id, name: User.name, account: User.account, avatar: User.avatar }
          })
        })
        return res.json({ tweets })
      })
  }
}
module.exports = userController
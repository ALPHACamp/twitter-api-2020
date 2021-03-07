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
  signIn: async (req, res) => {
    if (!req.body.account || !req.body.password) {
      return res.json({ status: 'error', message: "required fields didn't exist" })
    }
    const user = await User.findOne({ where: { account: req.body.account } })
    if (!user) return res.status(401).json({ status: 'error', message: 'no such user found' })
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(401).json({ status: 'error', message: 'passwords did not match' })
    }
    if (user.role === 'admin') { return res.json({ status: 'error', message: "admin can't signin" }) }
    const { id, name, account, email, avatar, role } = user
    var payload = { id }
    var token = jwt.sign(payload, process.env.JWT_SECRET)
    return res.json({
      status: 'success', message: 'ok', token,
      user: { id, name, account, email, avatar, role }
    })
  },
  signUp: async (req, res) => {
    const { account, name, email, password, checkPassword } = req.body
    if (!account || !password || !name || !email || !checkPassword) {
      return res.json({ status: 'error', message: "required fields didn't exist" })
    }
    const user = await User.findOne({ where: { email } })
    if (user) { return res.json({ status: 'error', message: "this email already exists " }) }
    if (password !== checkPassword) {
      return res.json({ status: 'error', message: "password and checkPassword didn't match" })
    }
    User.create({ account, name, email, password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null) })
      .then(() => res.json({ status: 'success', message: "signup successfully" }))
  },
  getCurrentUser: async (req, res) => {
    const user = await User.findByPk(helpers.getUser(req).id)
    const { id, name, account, avatar, role } = user
    return res.json({ id, name, account, avatar, role })
  },
  editUser: async (req, res) => {
    const { name, account, email, password, checkPassword, cover, avatar, introduction } = req.body
    if (password) {
      if (password !== checkPassword) {
        return res.json({ status: 'error', message: "password and passwordCheck didn't match" })
      }
      return password = await bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
    }
    const { files } = req
    if (files) {
      // console.log(files['cover'][0].path)//  確定程式跑到這都沒問題，可拿到 temp/0b4c8ff45edde0f788125b4db8078f6c
      imgur.setClientId(process.env.IMGUR_CLIENT_ID)
      imgur.uploadFile(files.path)
        .then((img) => {
          console.log(img.data.link)
          console.log(img.link)
          User.findByPk(helpers.getUser(req).id)
            .then(user => {
              user.cover = user.cover ? user.cover : null
              user.avatar = user.avatar ? user.avatar : null
              user.update({
                name, account, email, password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null), introduction,
                cover: files ? img.data.link : user.cover
                // avatar: files['avatar'][0] ? img.link : user.avatar
              }).then(() => { return res.json({ status: 'success', message: "user profiles has updated!" }) })
            })
        })
    } else {  // 以下程式也確認沒問題，可成功更新資料
      const user = await User.findByPk(helpers.getUser(req).id)
      user.update({
        name, account, email, password, introduction, cover: cover ? cover : null, avatar: avatar ? avatar : null,
      }).then(() => { return res.json({ status: 'success', message: "user's profile has updated!" }) })
    }
  },
  getUser: async (req, res) => { //取得任一使用者資料
    const id = req.params.id
    const tweets = await Tweet.count({ where: { UserId: id } })
    const user = await User.findOne({
      where: { id },
      include: [{ model: User, as: 'Followers' }, { model: User, as: 'Followings' }]
    })
    let isFollowed = false
    if (Array.isArray(helpers.getUser(req).Followings)) { // 如果helpers.getUser(req).Followings是陣列會回傳true
      isFollowed = helpers.getUser(req).Followings.map(d => d.id).includes(user.id)
    }
    const tweetsNumber = tweets // 使用者推文數
    const { name, account, email, avatar, cover, introduction } = user.dataValues
    const followingsNumber = user.dataValues.Followings.length // 使用者追蹤數
    const followersNumber = user.dataValues.Followers.length// 使用者跟隨數
    return res.json({ id, name, account, email, tweetsNumber, avatar, cover, introduction, followingsNumber, followersNumber, isFollowed })
  },
  getUserTweets: async (req, res) => {
    const tweet = await Tweet.findAll({ where: { UserId: req.params.id }, order: [['createdAt', 'DESC']], include: [Reply, User, { model: User, as: 'LikedUsers' }] })
    const tweets = []
    tweet.map((t) => {
      let isLiked = false
      if (Array.isArray(helpers.getUser(req).LikedTweets)) {
        isLiked = helpers.getUser(req).LikedTweets.map(d => d.id).includes(t.id)// 是否按過like
      }
      const { id, description, createdAt, User, LikedUsers, Replies } = t.dataValues
      const likesNumber = LikedUsers.length   // 推文like數
      const repliesNumber = Replies.length  // 推文回覆數
      tweets.push({ id, description, likesNumber, repliesNumber, isLiked, createdAt, User: { id: User.id, name: User.name, account: User.account, avatar: User.avatar } })
    })
    return res.json(tweets)
  },
  getUserReplies: async (req, res) => {
    const reply = await Reply.findAll({ where: { UserId: req.params.id }, order: [['createdAt', 'DESC']], include: [Tweet, { model: Tweet, include: [Reply, User, { model: User, as: 'LikedUsers' }] }] })
    const replies = []
    reply.map((r) => {
      let isLiked = false
      if (Array.isArray(helpers.getUser(req).LikedTweets)) {
        isLiked = helpers.getUser(req).LikedTweets.map(d => d.id).includes(r.id) // 是否按過like
      }
      const comment = r.dataValues.comment
      const { id, description, createdAt, LikedUsers, Replies, User } = r.dataValues.Tweet
      const likesNumber = LikedUsers.length // 推文like數
      const repliesNumber = Replies.length  // 推文回覆數
      const tweetData = { comment, tweetId: id, description, likesNumber, repliesNumber, isLiked, createdAt, User: { id: User.id, name: User.name, account: User.account, avatar: User.avatar } }
      replies.push(tweetData)
    })
    return res.json(replies)
  },
  addFollowing: (req, res) => {
    if (req.body.id == helpers.getUser(req).id) { return res.json({ status: 'error', message: "can't follow yourself!" }) }
    Followship.create({
      followerId: helpers.getUser(req).id,
      followingId: req.body.id
    }).then(() => res.json({ status: 'success', message: "create followship successfully!" }))
  },
  removeFollowing: async (req, res) => {
    const followship = await Followship.findOne({ where: { followerId: helpers.getUser(req).id, followingId: req.params.followingId } })
    if (!followship) {
      return res.json({ status: 'error', message: `has no followship with ${req.params.followingId}` })
    }
    followship.destroy()
      .then(() => { return res.json({ status: 'success', message: "remove followship successfully!" }) })
  },
  getUserFollowings: async (req, res) => { // 取得 :userId 的追蹤者
    const user = await User.findOne({ where: { id: req.params.id }, include: [{ model: User, as: 'Followings' }] })
    const tweetsNumber = await Tweet.count({ where: { UserId: req.params.id } }) // 使用者推文數
    const { id, name, Followings } = user.dataValues
    const followings = await Followings.map((d) => {
      let isFollowed = false
      if (Array.isArray(helpers.getUser(req).Followings)) {
        isFollowed = helpers.getUser(req).Followings.map(f => f.id).includes(d.id)
      }
      return {
        id: d.id,
        name: d.name,
        account: d.account,
        avatar: d.avatar,
        introduction: d.introduction,
        isFollowed
      }
    })
    if (Followings.length === 0) { return res.json([{ id, name, tweetsNumber, followings }]) }
    else { return res.json([{ followingId: Followings[0].Followship.followingId }, { id, name, tweetsNumber, followings }]) }
  },
  getUserFollowers: async (req, res) => {
    const user = await User.findOne({ where: { id: req.params.id }, include: [{ model: User, as: 'Followers' }] })
    const tweetsNumber = await Tweet.count({ where: { UserId: req.params.id } }) // 使用者推文數
    const { id, name, Followers } = user.dataValues
    const followers = await Followers.map((d) => {
      let isFollowed = false
      if (Array.isArray(helpers.getUser(req).Followings)) {
        isFollowed = helpers.getUser(req).Followings.map(f => f.id).includes(d.id)
      }
      return {
        id: d.id,
        name: d.name,
        account: d.account,
        avatar: d.avatar,
        introduction: d.introduction,
        isFollowed
      }
    })
    if (Followers.length === 0) { return res.json([{ id, name, tweetsNumber, followers }]) }
    else { return res.json([{ followerId: Followers[0].Followship.followerId }, { id, name, tweetsNumber, followers }]) }
  },
  getTopUsers: async (req, res) => {
    let users = await User.findAll({ include: [{ model: User, as: 'Followers' }] })
    users = users.map((user) => {
      let isFollowed = false
      if (Array.isArray(helpers.getUser(req).Followings)) {
        isFollowed = helpers.getUser(req).Followings.map(f => f.id).includes(user.dataValues.id)
      }
      return {
        id: user.dataValues.id,
        name: user.dataValues.name,
        avatar: user.dataValues.avatar,
        account: user.dataValues.account,
        FollowerCount: user.Followers.length,
        isFollowed
      }
    })
    users = users.sort((a, b) => b.FollowerCount - a.FollowerCount).slice(0, 10)
    return res.json({ users })
  },
  getUserLikes: async (req, res) => {
    let likes = await Like.findAll({
      where: { UserId: req.params.id }, include: [Tweet, User, { model: Tweet, include: [Reply, User, { model: User, as: 'LikedUsers' }] }]
    })
    const tweets = likes.map((like) => {
      const { id, description, createdAt, LikedUsers, Replies, User } = like.dataValues.Tweet
      let isLiked = false
      if (Array.isArray(helpers.getUser(req).LikedTweets)) {
        isLiked = helpers.getUser(req).LikedTweets.map(d => d.id).includes(id)
      }
      return {
        TweetId: id,
        description,
        likesNumber: LikedUsers.length,
        repliesNumber: Replies.length,
        isLiked,
        createdAt,
        User: { id: User.id, name: User.name, account: User.account, avatar: User.avatar }
      }
    })
    return res.json(tweets)
  }
}
module.exports = userController
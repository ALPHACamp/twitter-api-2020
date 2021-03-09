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
    const userAccount = await User.findOne({ where: { account } })
    if (userAccount) { return res.json({ status: 'error', message: "this account already exists " }) }
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
    const { name, account, email, password, checkPassword, introduction } = req.body
    if (password) {
      if (password !== checkPassword) {
        return res.json({ status: 'error', message: "password and passwordCheck didn't match" })
      }
      return password = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
    }
    //上傳多張圖片
    const user = await User.findByPk(helpers.getUser(req).id)
    console.log(user)
    let coverImg = user.dataValues.cover
    let avatarImg = user.dataValues.avatar
    const { files } = req
    console.log(files)
    imgur.setClientId(process.env.IMGUR_CLIENT_ID)
    if (files.cover) {
      coverImg = await imgur.uploadFile(files.cover[0].path)
      console.log(coverImg)
    }
    if (files.avatar) {
      avatarImg = await imgur.uploadFile(files.avatar[0].path)
      console.log(avatarImg)
    }
    user.update({ name, account, email, password, introduction, cover: coverImg.link, avatar: avatarImg.link })
      .then(() => { return res.json({ status: 'success', message: "user's profile has updated!" }) })
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
    let introduction = null
    if (user.dataValues.introduction) { introduction = user.dataValues.introduction.slice(0, 49) }
    const tweetsNumber = tweets // 使用者推文數
    const { name, account, email, avatar, cover } = user.dataValues
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
      tweets.push({ id, description: description.slice(0, 139), likesNumber, repliesNumber, isLiked, createdAt, User: { id: User.id, name: User.name, account: User.account, avatar: User.avatar } })
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
      const comment = r.dataValues.comment.slice(0, 139)
      const { id, description, createdAt, LikedUsers, Replies, User } = r.dataValues.Tweet
      const likesNumber = LikedUsers.length // 推文like數
      const repliesNumber = Replies.length  // 推文回覆數
      const tweetData = { comment, tweetId: id, description: description.slice(0, 139), likesNumber, repliesNumber, isLiked, createdAt, User: { id: User.id, name: User.name, account: User.account, avatar: User.avatar } }
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
  getUserFollowings: (req, res) => { // 取得 :userId 的追蹤者
    User.findOne({ where: { id: req.params.id }, include: [{ model: User, as: 'Followings', order: [['createdAt', 'DESC']] }] })
      .then(user => {
        let followings = user.Followings.map((d) => {
          let isFollowed = false
          if (Array.isArray(helpers.getUser(req).Followings)) {
            isFollowed = helpers.getUser(req).Followings.map(f => f.id).includes(d.id)
          }
          let introduction = null
          if (d.introduction) { introduction = d.introduction.slice(0, 49) }
          return {
            followingId: d.id,
            name: d.name,
            account: d.account,
            avatar: d.avatar,
            introduction,
            createdAt: d.createdAt,
            isFollowed
          }
        })
        followings.sort((a, b) => b.createdAt - a.createdAt)
        return res.json(followings)
      })
  },
  getUserFollowers: async (req, res) => {
    const user = await User.findOne({ where: { id: req.params.id }, order: [['createdAt', 'DESC']], include: [{ model: User, as: 'Followers' }] })
    const { Followers } = user.dataValues
    let followers = Followers.map((d) => {
      let isFollowed = false
      if (Array.isArray(helpers.getUser(req).Followings)) {
        isFollowed = helpers.getUser(req).Followings.map(f => f.id).includes(d.id)
      }
      let introduction = null
      if (d.introduction) { introduction = d.introduction.slice(0, 49) }
      return {
        followerId: d.id,
        name: d.name,
        account: d.account,
        avatar: d.avatar,
        introduction,
        isFollowed
      }
    })
    followers.sort((a, b) => b.createdAt - a.createdAt)
    return res.json(followers)
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
      where: { UserId: req.params.id }, order: [['createdAt', 'DESC']], include: [Tweet, User, { model: Tweet, include: [Reply, User, { model: User, as: 'LikedUsers' }] }]
    })
    const tweets = likes.map((like) => {
      const { id, description, createdAt, LikedUsers, Replies, User } = like.dataValues.Tweet
      let isLiked = false
      if (Array.isArray(helpers.getUser(req).LikedTweets)) {
        isLiked = helpers.getUser(req).LikedTweets.map(d => d.id).includes(id)
      }
      return {
        TweetId: id,
        description: description.slice(0, 139),
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
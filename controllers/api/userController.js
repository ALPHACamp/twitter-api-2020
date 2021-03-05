const db = require('../../models')
const { User, Tweet, Like, Reply, Followship } = db
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const userController = {
  signIn: (req, res) => {   // payLoad: { account, password }
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
  getUser: (req, res) => { //取得任一使用者資料
    const id = req.params.id
    Promise.all([
      User.findByPk(id, { raw: true }),
      Tweet.findAll({ where: { UserId: id } }),
      User.findAll({ include: [{ model: User, as: 'Followers', where: { id } }, { model: User, as: 'Followings', where: { id } }] })
    ]).then(([user, tweets, followings, followers]) => {
      const { id, name, account, email, avatar, cover, introduction } = user
      const tweetsNumber = tweets ? tweets.length : 0 // 使用者推文數
      const followingsNumber = followings ? followings.length : 0 // 使用者追蹤數
      const followersNumber = followers ? followers.length : 0 // 使用者跟隨數
      const isFollowed = req.user.Followings.map(d => d.id).includes(user.id) // 是否追蹤中
      return res.json({ user: { id, name, account, email, avatar, cover, introduction, tweetsNumber, followingsNumber, followersNumber, isFollowed } })
    })
  },
  getUserTweets: (req, res) => {
    const id = req.params.id
    Promise.all([
      User.findByPk(id, { raw: true }),
      Tweet.findAll({ where: { UserId: id }, raw: true, nest: true, order: [['createdAt', 'DESC']], include: [Reply, { model: User, as: 'LikedUsers' }] })
    ]).then(([user, tweet]) => {
      const User = { id: user.id, name: user.name, account: user.account, avatar: user.avatar }
      const tweets = []
      const likesNumber = tweet.LikedUsers ? tweet.LikedUsers.length : 0   // 推文like數
      const repliesNumber = tweet.RepliedUsers ? tweet.RepliedUsers.length : 0  // 推文回覆數
      const isLiked = req.user.LikedTweets.map(d => d.id).includes(tweet.id) // 是否按過like
      tweet.map(t => {
        const tweetData = { id: t.id, description: t.description, likesNumber, repliesNumber, isLiked, createdAt: t.createdAt, User }
        tweets.push(tweetData)
      })
      return res.json({ tweets })
    })
  },
  getUserReplies: (req, res) => {
    Reply.findAll({ where: { UserId: req.params.id }, order: [['createdAt', 'DESC']], include: [{ model: Tweet, include: [{ model: User, as: 'LikedUsers' }] }] })
      .then((reply) => {
        const replies = []
        reply.map(r => {
          const likesNumber = r.Tweet.LikedUsers ? r.Tweet.LikedUsers.length : 0  // 推文like數
          const repliesNumber = r.Tweet.RepliedUsers ? r.Tweet.RepliedUsers.length : 0  // 推文回覆數
          const tweetData = { id: r.Tweet.id, description: r.Tweet.description, likesNumber, repliesNumber, createdAt: r.Tweet.createdAt }
          replies.push(tweetData)
        })
        return res.json({ tweets: [replies] })
      })
  },
  addFollowing: (req, res) => {
    Followship.create({
      followerId: req.user.id,
      followingId: req.params.followingId
    }).then(() => res.json({ status: 'success', message: "" }))
  },
  removeFollowing: (req, res) => {
    Followship.findOne({ where: { followerId: req.user.id, followingId: req.params.followingId } })
      .then(followship => {
        followship.destroy()
          .then(() => res.json({ status: 'success', message: "" }))
      })
  },
  getUserFollowings: (req, res) => { // 取得 :userId 的追蹤者
    const id = req.params.id
    Promise.all([
      User.findOne({ where: { id }, include: [{ model: User, as: 'Followings' }] }),
      Tweet.findAndCountAll({ where: { UserId: id } })
    ]).then(([user, tweet]) => {
      console.log(user.Followings)
      const tweetsNumber = tweet.count   // 使用者推文數
      return res.json({
        user: { id, name: user.name, tweetsNumber }
      })
    })
  },
  getUserFollowers: (req, res) => {
    const id = req.params.id
    Promise.all([
      User.findOne({ where: { id }, include: [{ model: User, as: 'Followers' }] }),
      Tweet.findAndCountAll({ where: { UserId: id } })
    ]).then(([user, tweet]) => {
      console.log(user.Followers)
      const tweetsNumber = tweet.count  // 使用者推文數
      return res.json({
        user: { id, name: user.name, tweetsNumber }
      })
    })
  },
  getTopUsers: (req, res) => {
    User.findAll({ include: [{ model: User, as: 'Followers' }] })
      .then(users => {
        users = users.map(user => ({
          ...user.dataValues,
          FollowerCount: user.Followers.length,
          isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
        }))
        users = users.sort((a, b) => b.FollowerCount - a.FollowerCount).slice(0, 10)
        return res.json({ users })
      })
  },
  getUserLikes: (req, res) => {
    Like.findAll({
      where: { UserId: req.params.id }, raw: true, nest: true,
      include: [{ model: Tweet, include: [User, { model: User, as: 'LikedUsers' }] }]
    })
      .then(async (likes) => {
        console.log(likes)
        const tweets = await likes.map(async (like) =>
        ({
          id: like.Tweet.id,
          description: like.Tweet.description,
          createdAt: like.Tweet.createdAt,
          likesNumber: await Like.count({ where: { TweetId: like.Tweet.id }, raw: true }),
          repliesNumber: await Reply.count({ where: { TweetId: like.Tweet.id }, raw: true }),
          isLiked: like.Tweet.LikedUsers.id === req.user.id,
          User: like.Tweet.User
        })
        )
        console.log(tweets)
        return res.json({ tweets })
      })
  }
}

module.exports = userController
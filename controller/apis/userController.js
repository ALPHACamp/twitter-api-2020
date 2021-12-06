const helper = require('../../_helpers')
const bcrypt = require('bcryptjs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = '820069e8ac75862'
const db = require('../../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const { sequelize } = require('../../models')

const { json } = require('body-parser')
const { image } = require('faker/locale/de')

const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const userController = {
  signIn: (req, res) => {
    // 檢查必要資料
    if (!req.body.account || !req.body.password) {
      return res
        .status(401)
        .json({ status: 'error',message: "required fields didn't exist" })
    }
    User.findOne({ where: { account: req.body.account } }).then(user => {
      if (!user) { //if user is not exist
        return res
          .status(401)
          .json({ status: 'error', message: 'user is not exist.' })
      }
      if (!bcrypt.compareSync(req.body.password, user.password)) { 
        return res //if password not match
          .status(401)
          .json({ status: 'error', message: 'email or password incorrect.' })
      }
      // 簽發 token
      var payload = { id: user.id }
      var token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.status(200).json({
        status: 200,
        message: 'pass',
        token: token,
        user: {
          id: user.id,
          name: user.name,
          account: user.account,
          email: user.email,
          role: user.role,
          avatar: user.avatar
        }
      })
    })
  },
  signUp: async (req, res, cb) => {
    if (req.body.checkPassword !== req.body.password) {
      return res.json({ status: 'error', message: '兩次密碼輸入不相同！' })
    } else {
      try {
        const user = await User.findOne({ where: { email: req.body.email } })
        if (user) {
          return res.json({ status: 'error', message: '信箱重複！' })
        }
      } catch (err) {
        console.log(err)
      }
    }
    try {
      await User.create({
        account: req.body.account,
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(
          req.body.password,
          bcrypt.genSaltSync(10),
          null
        )
      })
      return res.json({ status: 'success', message: '成功註冊帳號！' })
    } catch (err) {
      console.log(err)
      return res.status(401).json({ status: 'error', message: err })
    }
  },
  getUser: async (req, res, cb) => {
    try {
      const userProfile = await User.findByPk(req.params.id, {
        attributes: {
          include: [
            [
              sequelize.literal(
                `(SELECT Count(*) FROM Followships AS f WHERE f.followerId=${req.params.id})`
              ),
              'following_count'
            ],
            [
              sequelize.literal(
                `(SELECT Count(*) FROM Followships AS f WHERE f.followingId=${req.params.id})`
              ),
              'follower_count'
            ],
            [
              sequelize.literal(
                `(SELECT Count(*) FROM Tweets AS t WHERE t.UserId=${req.params.id})`
              ),
              'tweets_count'
            ]
          ]
        },
        raw: true,
        nest: true
      })
      const followship = await Followship.findOne({
        where: {
          followerId: helper.getUser(req).id,
          followingId: req.params.id
        }
      })
      const isFollowed = followship ? true : false
      if (userProfile.role === 'Admin') { //防止使用者搜尋Admin
        return res.status(401).json({ status: 'error', message: 'User is not exist' })
      }
      return res.status(200).json({ ...userProfile, isFollowed })
    } catch (err) {
      console.log(err)
      return res.status(401).message({ status: 'error', message: err })
    }
  },
  getUsers: async (req, res, cb) => {
    try {
      const users = await User.findAll({ 
        raw: true,
        nest: true,
        where: { role: null }
      })
      return res.status(200).json({ status: '200', message: 'success', users})
    } catch (err) {
      console.log(err)
      return res.status(401).json({ status: 'error', message: err })
    }
  },
  getTopUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: [
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)`
            ),
            'follower_count'
          ],
          'id',
          'name',
          'account'
        ],
        limit: 10,
        raw: true,
        nest: true,
        order: [[sequelize.col('follower_count'), 'DESC']]
      })
      const followingUsers = await Followship.findAll({
        where: { followerId: helper.getUser(req).id },
        attributes: ['followingId'],
        raw: true,
        nest: true
      })
      const followingIds = followingUsers.map(a => a.followingId)
      const topUser = users.map(user => ({
        ...user,
        isFollowed: followingIds.includes(user.id)
      }))
      return res.status(200).json(topUser)
    } catch (err) {
      console.log(err)
      return res.status(401).json({ status: 'error', message: err })
    }
  },
  getUserTweets: async (req, res) => {
    try {
      const tweets = await Tweet.findAll({
        attributes: {
          include: [
            [
              sequelize.fn(
                'COUNT',
                sequelize.fn('DISTINCT', sequelize.col('Replies.id'))
              ),
              'reply_count'
            ],
            [
              sequelize.fn(
                'COUNT',
                sequelize.fn('DISTINCT', sequelize.col('Likes.id'))
              ),
              'like_count'
            ]
          ]
        },
        include: [
          { model: Reply, attributes: [] },
          { model: Like, attributes: [] }
        ],
        where: { UserId: req.params.id },
        raw: true,
        nest: true,
        group: ['Tweet.id']
      })
      const likedTweets = await Like.findAll({
        where: { UserId: helper.getUser(req).id },
        attributes: ['TweetId'],
        raw: true,
        nest: true
      })
      const likedTweetIds = likedTweets.map(a => a.TweetId)
      const tweetTable = tweets.map(tweet => ({
        ...tweet,
        isLiked: likedTweetIds.includes(tweet.id)
      }))
      return res.status(200).json(tweetTable)
    } catch (err) {
      console.log(err)
      res.status(401).json({ status: 'error', message: err })
    }
  },
  getUserReplies: async (req, res) => {
    try {
      const replies = await Reply.findAll({
        where: { UserId: req.params.id },
        raw: true,
        nest: true,
        include: [{ model: Tweet, include: [User] }]
      })
      return res.status(200).json([...replies])
    } catch (err) {
      return res.status(401).json({ status: 'error', message: err })
    }
  },
  getUserLike: async (req, res) => {
    try {
      const data = await Tweet.findAll({
        where: {
          id: [ //使用SQL原生語法 subQuery出user like的tweetId,在以此條件與主查詢進行查找
            sequelize.literal(`
              SELECT TweetId
              FROM LIKES
              WHERE UserId = ${req.params.id}`
            )
          ]
        },
        raw: true,
        nest: true,
        attributes: [
          ['id', 'TweetId'],
          'description',
          [sequelize.col('User.id'), 'tweet_user_id'],
          [sequelize.col('User.name'), 'tweet_user_name'],
          [sequelize.col('User.account'), 'tweet_user_account'],
          [sequelize.col('User.avatar'), 'tweet_user_avatar'],
          [sequelize.fn('COUNT',sequelize.fn('DISTINCT', sequelize.col('Replies.id'))), 'reply_count'],
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('Likes.id'))), 'like_count'],
          'createdAt'
        ],
        include: [
          { model: Reply, attributes: [] },
          { model: Like, attributes: [] },
          { model: User, attributes: [] }
        ],
        group: ['TweetId']
      })
      const likedTweets = await Like.findAll({
        where: { UserId: helper.getUser(req).id },
        raw: true,
        nest: true
      })
      const likedTweetIds = likedTweets.map(a => a.TweetId)
      const userLikes = data.map(like => ({
        ...like,
        isLiked: likedTweetIds.includes(like.TweetId)
      }))
      return res.status(200).json(userLikes)
    } catch (err) {
      console.log(err)
      return res.status(401).json({ status: 'error', message: err })
    }
  },
  getUserFollowings: async (req, res) => {
    try {
      const user = await User.findAll({
        where: { id: req.params.id },
        include: [{ model: User, as: 'Followings' }],
        raw: true,
        nest: true
      })
      const following = user.map(u => ({
        followingId: u.Followings.id,
        followingName: u.Followings.name,
        followingAccount: u.Followings.account,
        followingAvatar: u.Followings.avatar,
        followingIntro: u.Followings.introduction
      }))
      if (!user) {
        return res.status(400).json({ message: 'cannot find user' })
      }

      return res.status(200).json(following)
    } catch (err) {
      console.log(err)
      return res.status(400).json({ message: err })
    }
  },
  getUserFollowers: async (req, res) => {
    try {
      const user = await User.findAll({
        where: { id: req.params.id },
        include: [
          {
            model: User,
            as: 'Followers'
          }
        ],
        raw: true,
        nest: true
      })

      if (!user) {
        return res.status(400).json({ message: 'cannot find user' })
      }
      const followingUsers = await Followship.findAll({
        where: { followerId: helper.getUser(req).id },
        attributes: ['followingId'],
        raw: true,
        nest: true
      })
      const followingIds = followingUsers.map(a => a.followingId)
      const follower = user.map(u => ({
        followerId: u.Followers.id,
        followerAccount: u.Followers.account,
        followerName: u.Followers.name,
        followerIntro: u.Followers.introduction,
        followerAvatar: u.Followers.avatar,
        isFollowed: followingIds.includes(u.Followers.id)
      }))

      return res.status(200).json(follower)
    } catch (err) {
      console.log(err)
      return res.status(400).json({ message: err })
    }
  },
  putUser: async (req, res) => {
    const { files } = req
    if (files) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      if (files.avatar) {
        await imgur.upload(files.avatar[0].path, (err, avatarImg) => {
          return User.findByPk(req.params.id).then(user => {
            user.update({
              name: req.body.name,
              introduction: req.body.introduction,
              avatar: avatarImg.data.link || user.avatar
            })
          })
        })
      }
      if (files.cover) {
        await imgur.upload(files.cover[0].path, (err, coverImg) => {
          return User.findByPk(req.params.id).then(user => {
            user.update({
              name: req.body.name,
              introduction: req.body.introduction,
              cover: coverImg.data.link || user.cover
            })
          })
        })
      }
      return res.status(200).json({ message: 'success' })
    } else {
      return User.findByPk(req.params.id).then(user => {
        user
          .update({
            name: req.body.name,
            introduction: req.body.introduction,
            avatar: user.avatar,
            cover: user.cover
          })
          .then(() => {
            return res.status(200).json({ message: 'success' })
          })
      })
    }
  },
  getCurrentUser: async (req, res) => {
    try {
      const user = await User.findByPk(helper.getUser(req).id, {
        raw: true,
        nest: true
      })
      return res.status(200).json(user)
    } catch (err) {
      console.log(err)
      return res.status(401).json({ status: 'error', message: err })
    }
  },
  postFollow: async (req, res) => {
    try {
      console.log(req.user.id)
      await Followship.create({
        followerId: helper.getUser(req).id,
        followingId: req.body.id
      })
    } catch (err) {
      console.log(err)
      return res.status(401).json({ message: err })
    }
  },
  deleteFollow: async (req, res) => {
    try {
      await Followship.destroy({
        where: {
          followerId: helper.getUser(req).id,
          followingId: req.params.id
        }
      })
      return res.status(200).json({ message: '成功移除 follow' })
    } catch (err) {
      console.log(err)
      return res.status(401).json({ status: 'error', message: err })
    }
  }
}

module.exports = userController

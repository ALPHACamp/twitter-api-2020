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
const { Op } = require('sequelize')
const uploadImage = require('../../utils/image')
const validator = require('validator')

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const { sequelize } = require('../../models')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const userController = {
  signIn: (req, res) => {
    // 檢查必要資料
    if (!req.body.account || !req.body.password) {
      return res.json({
        status: 'error',
        message: '所有欄位必填！'
      })
    }
    User.findOne({ where: { account: req.body.account } }).then(user => {
      if (!user) {
        //if user is not exist
        return res.json({ status: 'error', message: '帳號不存在！' })
      }
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res //if password not match
          .json({ status: 'error', message: '密碼錯誤！' })
      }
      if (user.role === 'admin') {
        return res.json({ message: '請使用管理員登錄系統' })
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
    try {
      const { account, name, email, password, checkPassword } = req.body
      if (!account || !name || !email || !password || !checkPassword) {
        return res.json({ status: 'error', message: '所有欄位都是必填。' })
      }
      if (account.trim().length < 1) {
        return res.json({ status: 'error', message: '帳號不能空白！' })
      }
      if (!validator.isEmail(email)) {
        return res.json({ status: 'error', message: '請使用正確 email 格式！' })
      }
      if (name.trim().length < 1) {
        return res.json({ status: 'error', message: '名字不能空白！' })
      }
      if (name.length > 60) {
        return res.json({ status: 'error', message: '名字字數超過上限！' })
      }
      if (password.trim().length < 8) {
        return res.json({ status: 'error', message: '密碼字數低於下限！' })
      }
      if (checkPassword !== password) {
        return res.json({ status: 'error', message: '兩次密碼輸入不相同！' })
      }

      const user = await User.findOne({
        where: {
          [Op.or]: [{ email: req.body.email }, { account: req.body.account }]
        }
      })
      if (user) {
        return res.json({ status: 'error', message: '信箱或帳號重複！' })
      }

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
      return res.status(200).json({ status: 200, message: '成功註冊帳號！' })
    } catch (err) {
      console.log(err)
      return res.json({ status: 'error', message: err })
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
      if (userProfile.role === 'Admin') {
        //防止使用者搜尋Admin
        return res
          .status(400)
          .json({ status: 'error', message: 'User is not exist' })
      }
      return res.status(200).json({ ...userProfile, isFollowed })
    } catch (err) {
      console.log(err)
      return res.status(400).message({ status: 'error', message: err })
    }
  },
  getUsers: async (req, res, cb) => {
    try {
      const users = await User.findAll({
        raw: true,
        nest: true,
        where: { role: null }
      })
      return res.status(200).json({ status: 200, message: 'success', users })
    } catch (err) {
      console.log(err)
      return res.status(400).json({ status: 'error', message: err })
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
      return res.status(400).json({ status: 'error', message: err })
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
        group: ['Tweet.id'],
        order: [['createdAt', 'DESC']]
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
      res.status(400).json({ status: 'error', message: err })
    }
  },
  getUserReplies: async (req, res) => {
    try {
      const replies = await Reply.findAll({
        where: { UserId: req.params.id },
        raw: true,
        nest: true,
        include: [{ model: Tweet, include: [User] }],
        order: [['createdAt', 'DESC']]
      })
      return res.status(200).json([...replies])
    } catch (err) {
      return res.status(400).json({ status: 'error', message: err })
    }
  },
  getUserLike: async (req, res) => {
    try {
      const data = await Tweet.findAll({
        where: {
          id: [
            //使用SQL原生語法 subQuery出user like的tweetId,在以此條件與主查詢進行查找
            sequelize.literal(`
              SELECT TweetId
              FROM LIKES
              WHERE UserId = ${req.params.id}`)
          ]
        },
        raw: true,
        nest: true,
        attributes: [
          ['id', 'TweetId'],
          'description',
          [sequelize.col('User.id'), 'tweet_user_id'],
          [sequelize.col('Likes.createdAt'), 'like_createdAt'],
          [sequelize.col('User.name'), 'tweet_user_name'],
          [sequelize.col('User.account'), 'tweet_user_account'],
          [sequelize.col('User.avatar'), 'tweet_user_avatar'],
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
          ],
          'createdAt'
        ],
        include: [
          { model: Reply, attributes: [] },
          { model: Like, attributes: [] },
          { model: User, attributes: [] }
        ],
        group: ['TweetId', 'Likes.createdAt'],
        order: [[sequelize.col('like_createdAt'), 'DESC']]
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
      return res.status(400).json({ status: 'error', message: err })
    }
  },
  getUserFollowings: async (req, res) => {
    try {
      const user = await User.findAll({
        attributes: {
          include: [
            [
              sequelize.col('Followings->Followship.createdAt'),
              'following_createdAt'
            ]
          ]
        },
        where: { id: req.params.id },
        include: [{ model: User, as: 'Followings' }],
        raw: true,
        nest: true,
        order: [[sequelize.col('following_createdAt'), 'DESC']]
      })
      const followingUsers = await Followship.findAll({
        //find currentUser'followings
        where: { followerId: helper.getUser(req).id },
        attributes: ['followingId'],
        raw: true,
        nest: true
      })
      const followingIds = followingUsers.map(a => a.followingId)
      const following = user.map(u => ({
        following_createdAt: u.following_createdAt,
        followingId: u.Followings.id,
        followingName: u.Followings.name,
        followingAccount: u.Followings.account,
        followingAvatar: u.Followings.avatar,
        followingIntro: u.Followings.introduction,
        isFollowed: followingIds.includes(u.Followings.id) //compare status with currentUser and User
      }))
      if (!user) {
        return res
          .status(400)
          .json({ status: 400, message: 'cannot find user' })
      }
      return res.status(200).json(following)
    } catch (err) {
      console.log(err)
      return res.status(400).json({ status: 'error', message: err })
    }
  },
  getUserFollowers: async (req, res) => {
    try {
      const user = await User.findAll({
        attributes: {
          include: [
            [
              sequelize.col('Followers->Followship.createdAt'),
              'follower_createdAt'
            ]
          ]
        },
        where: { id: req.params.id },
        include: [
          {
            model: User,
            as: 'Followers'
          }
        ],
        raw: true,
        nest: true,
        order: [[sequelize.col('follower_createdAt'), 'DESC']]
      })
      if (!user) {
        return res
          .status(400)
          .json({ status: 400, message: 'cannot find user' })
      }
      const followingUsers = await Followship.findAll({
        where: { followerId: helper.getUser(req).id },
        attributes: ['followingId'],
        raw: true,
        nest: true
      })
      const followingIds = followingUsers.map(a => a.followingId)
      const follower = user.map(u => ({
        follower_createdAt: u.follower_createdAt,
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
      return res.status(400).json({ status: 'error', message: err })
    }
  },
  putUser: async (req, res) => {
    try {
      const { files } = req
      if (files) {
        if (req.body.name.trim().length < 1) {
          return res.status(400).json({ message: '名字不能空白！' })
        }
        if (req.body.name.length > 60) {
          return res.status(400).json({ message: '名字字數超出上限！' })
        }
        if (req.body.introduction.length > 170) {
          return res.status(400).json({ message: '自介字數超出上限！' })
        }

        imgur.setClientID(IMGUR_CLIENT_ID)
        let images = {}
        for (let i in files) {
          images[i] = await uploadImage(files[i][0].path)
        }
        if (req.body.isCanceled) {
          await User.update(
            {
              name: req.body.name,
              introduction: req.body.introduction,
              avatar: images.avatar
                ? images.avatar.data.link
                : helper.getUser(req).avatar,
              cover: null
            },
            { where: { id: helper.getUser(req).id } }
          )
          const user = await User.findByPk(helper.getUser(req).id)
          return res.status(200).json({ message: 'success', user })
        }
        await User.update(
          {
            name: req.body.name,
            introduction: req.body.introduction,
            avatar: images.avatar
              ? images.avatar.data.link
              : helper.getUser(req).avatar,
            cover: images.cover
              ? images.cover.data.link
              : helper.getUser(req).cover
          },
          { where: { id: helper.getUser(req).id } }
        )
        const user = await User.findByPk(helper.getUser(req).id)
        return res.status(200).json({ message: 'success', user })
      } else {
        if (req.body.name.trim().length < 1) {
          return res.status(400).json({ message: '名字不能空白！' })
        }
        if (req.body.name.length > 60) {
          return res.status(400).json({ message: '名字字數超出上限！' })
        }
        if (req.body.introduction.length > 170) {
          return res.status(400).json({ message: '自介字數超出上限！' })
        }
        if (req.body.isCanceled) {
          await User.update(
            {
              name: req.body.name,
              introduction: req.body.introduction,
              cover: null
            },
            { where: { id: helper.getUser(req).id } }
          )
          const user = await User.findByPk(helper.getUser(req).id)
          return res.status(200).json({ status: 200, message: 'success', user })
        }
        await User.update(
          {
            name: req.body.name,
            introduction: req.body.introduction
          },
          { where: { id: helper.getUser(req).id } }
        )
        const user = await User.findByPk(helper.getUser(req).id)
        return res.status(200).json({ status: 200, message: 'success', user })
      }
    } catch (err) {
      console.log(err)
      return res.status(400).json({ message: err })
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
      return res.status(400).json({ status: 'error', message: err })
    }
  },
  postFollow: async (req, res) => {
    try {
      const user = await Followship.findOrCreate({
        where: {
          followerId: helper.getUser(req).id,
          followingId: req.body.id
        }
      })
      return res
        .status(200)
        .json({ message: `成功追蹤 UserId:${req.body.id}`, user })
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
      return res.status(400).json({ status: 'error', message: err })
    }
  },
  accountSetting: async (req, res) => {
    try {
      const { account, password, checkPassword, name, email } = req.body
      if (!account || !name || !email || !password || !checkPassword) {
        return res.json({ status: 'error', message: '所有欄位都是必填。' })
      }
      if (account.trim().length < 1) {
        return res.json({ status: 'error', message: '帳號不能空白！' })
      }
      if (!validator.isEmail(email)) {
        return res.json({ status: 'error', message: '請使用正確 email 格式！' })
      }
      if (name.trim().length < 1) {
        return res.json({ status: 'error', message: '名字不能空白！' })
      }
      if (name.length > 60) {
        return res.json({ status: 'error', message: '名字字數超過上限！' })
      }
      if (password.trim().length < 8) {
        return res.json({ status: 'error', message: '密碼字數低於下限！' })
      }
      if (checkPassword !== password) {
        return res.json({ status: 'error', message: '兩次密碼輸入不相同！' })
      }
      const accountCheck = await User.findOne({ where: { account } })
      const emailCheck = await User.findOne({ where: { email } })
      if (accountCheck || emailCheck) {
        return res.json({ status: 'error', message: '帳號或信箱已被使用！' })
      }
      await User.update(
        {
          account,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
          name,
          email
        },
        { where: { id: helper.getUser(req).id } }
      )
      return res.status(200).json({ message: '成功更新 User 資料！' })
    } catch (err) {
      console.log(err)
      return res.json({ status: 'error', message: err })
    }
  }
}

module.exports = userController

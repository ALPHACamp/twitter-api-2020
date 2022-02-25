const { User, Tweet, Like, Reply, Followship } = require('../models')
const bcrypt = require('bcryptjs')
const sequelize = require('sequelize')
const helper = require('../_helpers')
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const jwt = require('jsonwebtoken')
const userServices = {
  signUp: (req, cb) => {
    return Promise.all([
      User.findOne({ where: { email: req.body.email } }),
      User.findOne({ where: { account: req.body.account } })
    ])
      .then(([email, account]) => {
        if (email) throw new Error('Email already exists!')
        if (account) throw new Error('Account already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        account: req.body.account,
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then((createdUser) => {
        createdUser = createdUser.toJSON()
        delete createdUser.password
        return cb(null, { user: createdUser })
      })
      .catch(err => cb(err))
  },
  signIn: async (req, cb) => {
    try {
      let result = {}
      const { account, password } = req.body
      if (!account || !password) {
        throw new Error('All fields are required!')
      }
      const user = await User.findOne({ where: { account } })
      if (!user) {
        throw new Error('User not found!')
      } else if (!bcrypt.compareSync(password, user.password)) {
        throw new Error('Incorrect Account or Password!')
      } else if (user.role !== 'user') {
        throw new Error('請使用一般帳戶登入!')
      } else {
        result = user.toJSON()
      }
      if (result) {
        const payload = { id: user.id }
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' })
        delete result.password
        return cb(null, { token, user: result })
      }
    } catch (err) {
      return cb(err)
    }
  },
  getUser: async (req, cb) => {
    try {
      const userData = await User.findByPk(req.params.id, {
        attributes: {
          include: [
            [sequelize.literal("(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id)"), 'tweetCount'],
            [sequelize.literal("(SELECT COUNT(*) FROM Likes WHERE Likes.UserId = User.id)"), 'likeCount'],
            [sequelize.literal("(SELECT COUNT(*) FROM Followships WHERE Followships.followerId = User.id)"), 'followerCount'],
            [sequelize.literal("(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)"), 'followingCount']
          ]
        },
      })
      const user = userData.toJSON()
      delete user.password
      return cb(null, user)
    } catch (err) {
      cb(err)
    }
  },
  putUser: async (req, cb) => {
    try {
      const { name, introduction } = req.body
      const userId = helper.getUser(req).id
      if (Number(req.params.id) !== userId) throw new Error('只有本人可以這樣做')
      // if (!name) throw new Error('name is required!')
      if (name && name.length > 50) throw new Error('暱稱字數超出上限！')
      if (introduction && introduction.length > 160) throw new Error('自我介紹字數超出上限！')
      const { files } = req
      if (files) {
        console.log(files)
        imgur.setClientId(IMGUR_CLIENT_ID)
        if (files.avatar) {
          // 如果有上傳avatar，直接上傳到imgur
          const avatar = await imgur.uploadFile(files.avatar[0].path)
          req.body.avatar = avatar.link
        }
        if (files.cover) {
          // 如果有上傳cover，直接上傳到imgur
          const cover = await imgur.uploadFile(files.cover[0].path)
          req.body.cover = cover.link
        }
      }
      const user = await User.findByPk(userId)
      if (!user) throw new Error("User didn't exist!")
      await user.update({
        name,
        introduction,
        avatar: avatar,
        cover: cover
      })
      return cb(null, user.toJSON())
    } catch (err) {
      cb(err)
    }
  },
  getUserTweets: async (req, cb) => {
    try {
      // 找出目標使用者的所有推文及喜歡 回覆數
      const userTweets = await Tweet.findAll({
        where: { userId: req.params.id },
        include: [
          { model: Like, attributes: [] },
          { model: Reply, attributes: [] },
          { model: User, attributes: ['account', 'name', 'avatar'] }
        ],
        attributes: {
          include: [
            [
              sequelize.fn(
                'COUNT',
                sequelize.fn('DISTINCT', sequelize.col('Likes.id'))
              ),
              'likeCount'
            ],
            [
              sequelize.fn(
                'COUNT',
                sequelize.fn('DISTINCT', sequelize.col('Replies.id'))
              ),
              'replyCount'
            ]
          ]
        },
        group: ['Tweet.id'],
        order: [
          ['createdAt', 'DESC']
        ]
      })
      // 找出目前使用者喜歡的推文
      const likedTweets = await Like.findAll({
        where: { userId: helper.getUser(req).id },
        attributes: ['tweetId'],
        raw: true
      })
      const likedData = likedTweets.map(data =>
        data.tweetId
      )
      // 目標使用者若無推文
      if (userTweets.length === 0) throw new Error("使用者尚無任何推文")
      const result = userTweets.map(tweet => ({
        ...tweet.toJSON(),
        isLiked: likedData.includes(tweet.id)
      }))
      return cb(null, result)
    } catch (err) {
      cb(err)
    }
  },
  getUserReplies: async (req, cb) => {
    try {
      // 找出目標使用者的所有回覆
      const userReplies = await Reply.findAll({
        where: { userId: req.params.id },
        include: [
          // 將回覆的使用者資訊in進來
          { model: User, attributes: ['account', 'name', 'avatar'] },
          // 將原推文及推文者資訊in進來 
          { model: Tweet, include: { model: User, attributes: ['account', 'name'] } },
        ],
        order: [
          ['createdAt', 'DESC']
        ],
        raw: true
      })
      // 目標使用者若無回覆
      if (userReplies.length === 0) throw new Error("使用者尚無任何回覆")
      return cb(null, userReplies)
    } catch (err) {
      cb(err)
    }
  },
  getUserLikes: async (req, cb) => {
    try {
      // 找出目標使用者的所有like 包含tweet及相關資訊並依喜歡由新到舊排序
      const likeData = await Like.findAll({
        where: { UserId: req.params.id },
        include: [{
          model: Tweet,
          include: [
            { model: User, attributes: ['id', 'account', 'name', 'avatar'] },
            { model: Reply, attributes: ['id'] },
            { model: Like, attributes: ['id', 'UserId'] }
          ]
        },],
        order: [
          ['createdAt', 'DESC']
        ],
        row: true,
        nest: true
      })
      const results = likeData.map((like) => {
        const userId = helper.getUser(req).id
        // 列出此tweet所有likes的userId
        const likedUsersId = like.Tweet.Likes.map(data =>
          data.UserId
        )
        // tweet層的資訊
        const tweet = {
          id: like.Tweet.id,
          description: like.Tweet.description,
          createdAt: like.Tweet.createdAt,
          replyCount: like.Tweet.Replies.length,
          likeCount: like.Tweet.Likes.length,
          User: like.Tweet.User,
          isLiked: likedUsersId.includes(userId)
        }
        //外層資訊
        const result = {
          id: like.id,
          createdAt: like.createdAt,
          TweetId: like.Tweet.id, // 應測試需求
          tweet
        }
        return result
      })
      return cb(null, results)
    } catch (err) {
      cb(err)
    }
  },
  getUserFollowings: async (req, cb) => {
    try {
      // 取得使用者的追蹤名單
      let followings = await Followship.findAll({
        where: { followerId: req.params.id },
        include: [{
          model: User,
          as: 'Followers',
          attributes: [
            'name',
            'account',
            'avatar',
            'createdAt',
            'introduction',
            // 比對id，看登入使用者是否也有在追蹤這些人
            //TODO 辨別Followers是不是使用者本身
            [sequelize.literal(`EXISTS (SELECT 1 FROM Followships WHERE followerId = ${helper.getUser(req).id} AND followingId = Followers.id)`), 'isFollowed']
          ],
        }],
        attributes: {
          exclude: [
            'email',
            'password',
            'introduction',
            'cover'
          ],
        },
        //以追隨日期排序
        order: [
          ['createdAt', 'DESC']
        ]
      })
      if (followings === null) { throw new Error("沒有這個使用者") }
      followings = followings.map(following => ({
        ...following.toJSON()
      }))
      return cb(null, followings)
    } catch (err) {
      return cb(err)
    }
  },
  getUserFollowers: async (req, cb) => {
    try {
      let followers = await Followship.findAll({
        where: { followingId: req.params.id },
        include: [{
          model: User,
          as: 'Followings',
          attributes: [
            'name',
            'account',
            'avatar',
            'createdAt',
            'introduction',
            // 比對id，看登入使用者是否也有在追蹤這些人
            //TODO 辨別Followings是不是使用者本身
            [sequelize.literal(`EXISTS (SELECT 1 FROM Followships WHERE followerId = ${helper.getUser(req).id} AND followingId = Followings.id)`), 'isFollowed']
          ],
        }],
        attributes: {
          exclude: [
            'email',
            'password',
            'introduction',
            'cover'
          ],
        },
        //以追隨日期排序
        order: [
          ['createdAt', 'DESC']
        ]
      })
      if (followers === null) { throw new Error("沒有這個使用者") }
      followers = followers.map(follower => ({
        ...follower.toJSON()
      }))
      return cb(null, followers)
    } catch (err) {
      return cb(err)
    }
  },
}
module.exports = userServices
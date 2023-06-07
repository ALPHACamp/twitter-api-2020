const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../models')
const { Op } = require('sequelize')
const { User, Tweet, Reply, Like } = db
const sequelize = require('sequelize')

const userController = {
  login: (req, res, next) => {
    try {
      // 製作token給使用者
      const userData = req.user
      delete userData.password

      const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: '30d'
      })
      res.status(200).json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  signup: async (req, res, next) => {
    try {
      // 註冊時，使用者可以設定 account、name、email 和 password
      const { account, name, email, password, checkPassword } = req.body
      if (!account || !name || !email || !password || !checkPassword) throw new Error('請輸入完整資訊')

      // check password
      if (password !== checkPassword) throw new Error('密碼不相同')

      // 檢查account, email 是否重複
      const user = await User.findOne({
        where: {
          [Op.or]: [
            { email: email },
            { account: account }
          ]
        }
      })
      if (user?.email === email) throw new Error('email 已重複註冊！')
      if (user?.account === account) throw new Error('account 已重複註冊！')
      // 創立新使用者
      await User.create({
        account,
        name,
        email,
        password: bcrypt.hashSync(password),
        role: 'user',
        createAt: new Date(),
        updatedAt: new Date()
      })
      // 回傳成功訊息
      res.json({
        status: 'success', message: '成功建立帳號'
      })
    } catch (err) {
      next(err)
    }
  },
  getUserData: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: {
          include: [
            [
              sequelize.literal(
                '(SELECT COUNT(*) FROM Followships WHERE followingId = User.id)'
              ),
              'followersCount'
            ],
            [
              sequelize.literal(
                '(SELECT COUNT(*) FROM Followships WHERE followerId = User.id)'
              ),
              'followingsCount'
            ]
          ]
        }
      })
      if (!user) throw new Error('使用者不存在！')
      // reorganize user data
      const userData = user.toJSON()
      delete userData.password

      res.status(200).json({
        ...userData
      })
    } catch (err) { next(err) }
  },
  putUserData: async (req, res, next) => {
    try {
      // write later
    } catch (err) {
      next(err)
    }
  },
  getUserTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        where: { UserId: req.params.id },
        include: [{ model: User, attributes: { exclude: ['password'] } }],
        order: [['createdAt', 'DESC']],
        nest: true,
        attributes: {
          include: [
            [
              sequelize.literal(
                '(SELECT COUNT(*) FROM Replies WHERE TweetId = Tweet.id)'
              ),
              'repliesCount'
            ],
            [
              sequelize.literal(
                '(SELECT COUNT(*) FROM Likes WHERE TweetId = Tweet.id AND isLike = 1)'
              ),
              'likesCount'
            ]
          ]
        }
      })

      const tweetsData = tweets.map(tweet => tweet.toJSON())
      res.status(200).json(tweetsData)
    } catch (err) {
      next(err)
    }
  },
  getUserReplies: async (req, res, next) => {
    try {
      const replies = await Reply.findAll({
        where: { UserId: req.params.id },
        include: [
          { model: User, attributes: { exclude: ['password'] } },
          { model: Tweet }
        ],
        order: [['createdAt', 'DESC']]
      })

      const repliesData = replies.map(reply => reply.toJSON())
      res.status(200).json(repliesData)
    } catch (err) {
      next(err)
    }
  },
  getUserLikes: async (req, res, next) => {
    try { // 找出Likes中 userId = 2 && isLike = 1的tweetsID,並顯示其資料，依照Likes UpdatedAt 排序
    } catch (err) {
      next(err)
    }
  },
  getFollowings: async (req, res, next) => {
    try { // 找出followerId = req.params.id的資料，並顯示出其Users data，加入isFollowing給前端判斷是否正在追蹤
    } catch (err) {
      next(err)
    }
  },
  getFollowers: async (req, res, next) => {
    try {
      // 找出followingId = req.params.id的資料，並顯示出其Users data，加入isFollowing給前端判斷是否正在追蹤
    } catch (err) {
      next(err)
    }
  }
}
module.exports = userController

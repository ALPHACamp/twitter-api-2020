const { User, Reply, Tweet, Like, Followship, sequelize } = require('../models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { getUser } = require('../_helpers')
const imgurFileHandler = require('../helpers/file-helper')

const userController = {
  register: async (req, res, next) => {
    try {
      const {name, account, email, password, checkPassword} = req.body
      if (!name.trim() ||
          !account.trim() ||
          !email.trim() ||
          !password.trim() ||
          !checkPassword.trim()) throw new Error('所有欄位必填。')

      if (req.body.password.trim() !== req.body.checkPassword.trim()) throw new Error('密碼與確認密碼不符。')
      if (
        await User.findOne({ where: { account: req.body.account }})||
        await User.findOne({ where: { email: req.body.email } })
        ) throw new Error('帳號或 email 已經註冊。')
        
      await User.create({
        account,
        name,
        email,
        password: bcrypt.hashSync(password, 10)
      })
      res.status(200).json({ message: '註冊成功' })
    } catch (err) {
      next(err)
    }
  },
  login: async (req, res, next) => {
    try {
      const user = getUser(req)
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.status(200).json({ token, user })
    } catch (err) {
      next(err)
    }
  },
  getUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: [
          'id', 'avatar', 'name', 'account', 'cover_image', 'introduction',
          [sequelize.literal('(SELECT COUNT(DISTINCT following_id) FROM Followships WHERE  following_id = User.id)'), 'followerCount'],
          [sequelize.literal('(SELECT COUNT(DISTINCT follower_id) FROM Followships WHERE  follower_id = User.id)'), 'folloingCount'],
          [sequelize.literal(`(SELECT COUNT(DISTINCT Tweets.id) FROM Tweets WHERE ${req.params.id} = User.id)`), 'tweetCount'],
        ],
        raw: true,
        nest: true
      })
      if (!user) throw new Error('無此使用者。')
      res.status(200).json(user)
    } catch (err) {
      next(err)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        where: { UserId: req.params.id },
        attributes: [
          'id','description', 'createdAt',
          [sequelize.literal('(SELECT COUNT(DISTINCT tweet_id) FROM Replies WHERE tweet_id = Tweet.id)'), 'replyCount'],
          [sequelize.literal('(SELECT COUNT(DISTINCT tweet_id) FROM Likes WHERE tweet_id = Tweet.id)'), 'likeCount']
        ],
        include: [{
          model: User,
          attributes: [
            'id', 'avatar', 'name', 'account'
          ]
        }],
        order: [['createdAt', 'DESC'], ['id', 'DESC']],
        raw: true,
        nest: true
      })
      if (!tweets.length) throw new Error('沒有任何推文。')
      res.status(200).json(tweets)
    } catch (err) {
      next(err)
    }
  },
  getRepliedTweets: async (req, res, next) => {
    try {
      const replies = await Reply.findAll({
        where: { UserId: req.params.id },
        attributes: ['id', 'comment', 'createdAt'],
        include: [{
          model: User,
          attributes: ['name', 'account']
        }, {
          model: Tweet,
          attributes: [], include: [{ 
              model: User,
              attributes: ['id', 'avatar', 'account']
            }
          ]
        }],
        order: [['createdAt', 'DESC'], ['id', 'DESC']],
        raw: true,
        nest: true
      })
      if (!replies.length) throw new Error('沒有回覆過的推文。')
      res.status(200).json(replies)
    } catch (err) {
      next(err)
    }
  },
  getLikes: async (req, res, next) => {
    try {
      const likes = await Like.findAll({
        where: { UserId: req.params.id },
        attributes: [
          'TweetId', 'createdAt',
          [sequelize.literal('(SELECT COUNT(tweet_id) FROM Likes WHERE tweet_id)'), 'likeCount'],
          [sequelize.literal('(SELECT COUNT(Replies.tweet_id) FROM Replies WHERE Replies.tweet_id = Like.tweet_id)'), 'replyCount'],
        ],
        include: [{
          model: Tweet, attributes: ['description'],
          include: [{
             model: User,
             attributes: ['id', 'avatar', 'name', 'account'],
             Where: { id: Tweet.userId }
          }]
        }],
        order: [['createdAt', 'DESC'], ['id', 'DESC']],
        raw: true,
        nest: true
      })
      if (!likes.length) throw new Error('沒有喜歡的推文。')
      res.status(200).json(likes)
    } catch (err) {
      next(err)
    }
  },
  getFollowings: async (req, res, next) => {
    try {
      const followings = await Followship.findAll({
        where: { followerId: req.params.id },
        attributes: [
          'followingId', 'createdAt',
          [sequelize.literal(`(SELECT avatar FROM Users WHERE id = following_id)`), 'avatar'],
          [sequelize.literal(`(SELECT name FROM Users WHERE id = following_id)`), 'name'],
          [sequelize.literal(`(SELECT introduction FROM Users WHERE id = following_id)`), 'introduction'],
          [sequelize.literal(`(CASE WHEN follower_id = ${req.params.id} THEN true ELSE false END)`), 'isFollowing']
        ],
        order: [['createdAt', 'DESC'], ['id', 'DESC']],
        raw: true,
        nest: true
      })
      if (!followings.length) throw new Error('沒有追隨者名單。')
      res.status(200).json(followings)
    } catch (err) {
      next(err)
    }
  },
  getFollowers: async (req, res, next) => {
    try {
      const followers = await Followship.findAll({
        where: { followingId: req.params.id },
        attributes: [
          'followerId', 'createdAt',
          [sequelize.literal(`(SELECT avatar FROM Users WHERE id = follower_id)`), 'avatar'],
          [sequelize.literal(`(SELECT name FROM Users WHERE id = follower_id)`), 'name'],
          [sequelize.literal(`(SELECT introduction FROM Users WHERE id = follower_id)`), 'introduction'],
          [sequelize.literal(`(CASE WHEN follower_id = ${req.params.id} THEN true ELSE false END)`), 'isFollowing']
        ],
        order: [['createdAt', 'DESC'], ['id', 'DESC']],
        raw: true,
        nest: true
      })
      if (!followers.length) throw new Error('沒有粉絲名單。')
      res.status(200).json(followers)
    } catch (err) {
      next(err)
    }
  },
  putUser: async (req, res, next) => {
    try {
      const logUser = getUser(req)

      const { name, introduction } = req.body
      let avatar = req.files?.avatar || null
      let coverImage = req.files?.cover_image || null

      if (!name.trim() || !introduction.trim()) throw new Error('名字和自我介紹欄不可為空。')
      if (introduction.length > 160) throw new Error('自我介紹字數不可超過 50 字。')
      if (name.length > 50) throw new Error('名字字數不可超過 50 字。')

      if (avatar) avatar = await imgurFileHandler(avatar[0])
      if (coverImage) coverImage = await imgurFileHandler(coverImage[0])

      const user = await User.findByPk(req.params.id)
      const userUpdate = await user.update({
        name,
        introduction,
        avatar: avatar || logUser.avatar,
        cover_image: coverImage || logUser.cover_image
      })
      res.status(200).json(userUpdate)
    } catch (err) {
      next(err)
    }
  },
  putUserSetting: async (req, res, next) => {
    try {
      const { name, account, email, password, checkPassword } = req.body
      const user = getUser(req)

      if (!name.trim() ||
        !account.trim() ||
        !email.trim() ||
        !password.trim() ||
        !checkPassword.trim()) throw new Error('所有欄位必填。')

      if (req.body.password.trim() !== req.body.checkPassword.trim()) throw new Error('密碼與確認密碼不符。')

      if (!account) throw new Error('帳號不可空白。')
      if (await User.findOne({ where:{ account } })) throw new Error('此帳號已經存在。')
      if (await User.findOne({ where: { email } })) throw new Error('此email已經存在。')
      if (password !== checkPassword) throw new Error('密碼與確認密碼不相符。')

      const userUpdate = await user.update({
        name,
        account,
        email,
        password: password ? bcrypt.hashSync(password, 10) : user.password,
      })
      res.status(200).json({ message: '成功修改個人資料', userUpdate })
    } catch (err) {
      next(err)
    }
  },
  getTopUsers: async (req, res, next) => {
    try {
      const topUsers = await Followship.findAll({
        attributes: [
          ['following_id', 'id'],
          [sequelize.literal(`(SELECT account FROM Users WHERE id = following_id)`), 'account'],
          [sequelize.literal(`(SELECT name FROM Users WHERE id = following_id)`), 'name'],
          [sequelize.literal(`(SELECT avatar FROM Users WHERE id = following_id)`), 'avatar'],
          [sequelize.literal(`(COUNT(follower_id))`), 'followerCount'],
        ],
        group: 'following_id',
        limit: 10,
        order: [[sequelize.col('followerCount'), 'DESC']]
      })
      if (!topUsers) throw new Error('查無資料。')
      
      const result = topUsers.map(user => ({
        ...user.toJSON(),
        isFollowing: req.user.Followings.some(f => f.id === user.id)
      }))
      
      res.status(200).json({ message: '前十人氣王', result })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = userController

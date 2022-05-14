const { User, Reply, Tweet, Like, Followship } = require('../models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { getUser } = require('../_helpers')
const sequelize = require('sequelize')

const userController = {
  register: async (req, res, next) => {
    try {
      if (req.body.password !== req.body.checkPassword) throw new Error('密碼與確認密碼不符。')
      if (
        await User.findOne({ where: { account: req.body.account }})||
        await User.findOne({ where: { email: req.body.email } })
        ) throw new Error('帳號或 email 已經註冊。')
        
      const user = await User.create({
        account: req.body.account,
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
      })
      res.status(200).json('註冊成功')
    } catch (err) {
      next(err)
    }
  },
  login: async (req, res, next) => {
    try {
      const user = getUser(req)
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.status(200).json({token, user})
    } catch (err) {
      next(err)
    }
  },
  getUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: [
          'avatar', 'name', 'account', 'cover_image', 'introduction',
          [sequelize.literal(`(SELECT id FROM Users WHERE id = ${req.params.id})`), 'userId'],
          [sequelize.literal('(SELECT COUNT(DISTINCT following_id) FROM Followships WHERE  following_id = User.id)'), 'followerCounts'],
          [sequelize.literal('(SELECT COUNT(DISTINCT follower_id) FROM Followships WHERE  follower_id = User.id)'), 'folloingCounts'],
          [sequelize.literal(`(SELECT COUNT(DISTINCT Tweets.id) FROM Tweets WHERE ${req.params.id} = User.id)`), 'tweetCounts'],
        ],
        raw: true,
        nest: true
      })
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
          [sequelize.literal(`(SELECT avatar FROM Users WHERE id = ${req.params.id})`), 'userAvatar'],
          [sequelize.literal(`(SELECT id FROM Users WHERE id = ${req.params.id})`), 'userId'],
          [sequelize.literal(`(SELECT name FROM Users WHERE id = ${req.params.id})`), 'name'],
          [sequelize.literal(`(SELECT account FROM Users WHERE id = ${req.params.id})`), 'account'],
          [sequelize.literal('(SELECT COUNT(DISTINCT tweet_id) FROM Replies WHERE tweet_id = Tweet.id)'), 'replyCounts'],
          [sequelize.literal('(SELECT COUNT(DISTINCT tweet_id) FROM Likes WHERE tweet_id = Tweet.id)'), 'likeCounts']
        ],
        order: [['createdAt', 'DESC'], ['id', 'DESC']],
        raw: true,
        nest: true
      })
      res.status(200).json(tweets)
    } catch (err) {
      next(err)
    }
  },
  getRepliedTweets: async (req, res, next) => {
    try {
      const replies = await Reply.findAll({
        where: { UserId: req.params.id, },
        attributes: [
          'id', 'comment', 'createdAt',
          [sequelize.literal(`(SELECT name FROM Users WHERE id = ${req.params.id})`), 'name'],
          [sequelize.col('account'), 'repliedAccount'],
          [sequelize.col('avatar'), 'repliedAvatar'],
          // [sequelize.col('repliedUserId'), 'repliedUserId']
        ],
        include: [{
          model: Tweet, attributes: [],
          include: [{ model: User, 
            attributes:['account', 'avatar',
              [sequelize.col('id'), 'repliedUserId']
          ],
            Where: { id: Tweet.userId } }]
        }],
        order: [['createdAt', 'DESC'], ['id', 'DESC']],
        raw: true
      })
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
          [sequelize.literal(`(SELECT avatar FROM Users WHERE id = ${req.params.id})`), 'avatar'],
          [sequelize.literal(`(SELECT id FROM Users WHERE id = ${req.params.id})`), 'userId'],
          [sequelize.literal(`(SELECT name FROM Users WHERE id = ${req.params.id})`), 'likedName'],
          [sequelize.literal(`(SELECT account FROM Users WHERE id = ${req.params.id})`), 'account'],
          [sequelize.literal('(SELECT description FROM Tweets WHERE Tweets.id = tweet_id)'), 'description'],
          [sequelize.literal('(SELECT COUNT(tweet_id) FROM Likes WHERE tweet_id)'), 'likeCounts'],
          [sequelize.literal('(SELECT COUNT(Replies.tweet_id) FROM Replies WHERE Replies.tweet_id = Like.tweet_id)'), 'replyCounts'],
          [sequelize.col('account'), 'likedAccount']
        ],
        include: [{
          model: Tweet, attributes: [],
          include: [{ model: User, Where: { id: Tweet.userId } }]
        }],
        order: [['createdAt', 'DESC'], ['id', 'DESC']],
        raw: true,
        nest: true
      })
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
          [sequelize.literal(`(SELECT avatar FROM Users WHERE id = ${req.params.id})`), 'avatar'],
          [sequelize.literal(`(SELECT id FROM Users WHERE id = ${req.params.id})`), 'userId'],
          [sequelize.literal(`(SELECT name FROM Users WHERE id = followingId)`), 'name'],
          [sequelize.literal(`(SELECT introduction FROM Users WHERE id = followingId)`), 'introduction'],
          [sequelize.literal(`(CASE WHEN follower_id = ${req.params.id} THEN true ELSE false END)`), 'isFollowing']
        ],
        order: [['createdAt', 'DESC'], ['id', 'DESC']],
        raw: true,
        nest: true
      })
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
          'followerId',
          [sequelize.literal(`(SELECT avatar FROM Users WHERE id = ${req.params.id})`), 'avatar'],
          [sequelize.literal(`(SELECT id FROM Users WHERE id = ${req.params.id})`), 'userId'],
          [sequelize.literal(`(SELECT name FROM Users WHERE id = followerId)`), 'name'],
          [sequelize.literal(`(SELECT introduction FROM Users WHERE id = followerId)`), 'introduction'],
          [sequelize.literal(`(CASE WHEN following_id = ${req.params.id} THEN true ELSE false END)`), 'isFollowing']
        ],
        order: [['createdAt', 'DESC'], ['id', 'DESC']],
        raw: true,
        nest: true
      })
      res.status(200).json(followers)
    } catch (err) {
      next(err)
    }
  },
  putUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id)
      const userUpdate = await user.update(req.body)
      res.status(200).json(userUpdate)
    } catch (err) {
      next(err)
    }
    res.status(200).json()
  } 
}
module.exports = userController

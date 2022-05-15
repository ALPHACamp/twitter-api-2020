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
          'id', 'avatar', 'name', 'account', 'cover_image', 'introduction',
          [sequelize.literal('(SELECT COUNT(DISTINCT following_id) FROM Followships WHERE  following_id = User.id)'), 'followerCount'],
          [sequelize.literal('(SELECT COUNT(DISTINCT follower_id) FROM Followships WHERE  follower_id = User.id)'), 'folloingCount'],
          [sequelize.literal(`(SELECT COUNT(DISTINCT Tweets.id) FROM Tweets WHERE ${req.params.id} = User.id)`), 'tweetCount'],
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

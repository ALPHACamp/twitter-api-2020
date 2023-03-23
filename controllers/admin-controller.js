const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { Tweet, User, Sequelize, Reply } = require('../models')
const adminController = {
  // 登入
  signIn: async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Email and password are required' })
    }
    try {
      const user = await User.findOne({ where: { email } })
      if (!user) return res.status(404).json({ status: 'error', message: 'User does not exist' })
      if (user.role === 'user') return res.status(404).json({ status: 'error', message: 'User does not exist' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: 'Incorrect password' })
      }
      const userData = user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET)
      return res.status(200).json({
        status: 'success',
        message: 'Successfully sign in',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  }, // 推文清單(每筆資料顯示推文內容的前50字)
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        attributes: [
          'id',
          'UserId',
          'description',
          'createdAt',
          'updatedAt',
          [Sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id )'), 'reply_count'],
          [Sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id )'), 'like_count']
        ],
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'account', 'avatar']
          },
          {
            model: Reply,
            attributes: { exclude: 'TweetId' },
            include: [
              {
                model: User,
                attributes: ['id', 'name', 'account', 'avatar']
              }
            ]
          }
        ],
        order: [['updatedAt', 'DESC']],
        nest: true
      })
      const modifiedTweets = tweets.map(tweet => {
        tweet.description = tweet.description.substring(0, 50)
        return tweet
      })
      return res.status(200).json(modifiedTweets)
    } catch (error) {
      return next(error)
    }
  },
  deleteTweet: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id)
      if (!tweet) { return res.status(400).json({ status: 'error', message: "Tweet didn't exist!" }) }
      await tweet.destroy()
      return res.json({
        status: 'success',
        message: 'Successfully deleted the tweet',
        data: { tweet }
      })
    } catch (err) {
      next(err)
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        attributes: [
          'id',
          'name',
          'account',
          'avatar',
          'cover',
          'introduction',
          'role',
          [Sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id )'), 'tweet_count'],
          [Sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.FollowerId = User.id )'), 'following_count'],
          [Sequelize.literal('(SELECT COUNT(*) FROM Followships  WHERE Followships.FollowingId = User.id )'), 'follower_count'],
          [Sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.UserId = User.id )'), 'total_like']
        ],
        order: [['createdAt', 'DESC']],
        nest: true,
        raw: true
      })
      return res.status(200).json(users)
    } catch (err) {
      next(err)
    }
  }
}
module.exports = adminController

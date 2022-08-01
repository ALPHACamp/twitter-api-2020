const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sequelize = require('sequelize')

const helpers = require('../_helpers')
const { User, Tweet, Like, Reply } = require('../models')

const userController = {
  signin: async (req, res, next) => {
    try {
      const { account, password } = req.body

      // Check if any field remains blank
      if (!account?.trim() || !password?.trim()) {
        return res.status(400).json({
          status: 'error',
          message: 'All fields are required.'
        })
      }

      // Find user
      const user = await User.findOne({
        raw: true,
        where: {
          account,
          role: 'user'
        }
      })

      // Check if admin exists and password correct
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'Account not exists for users'
        })
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({
          status: 'error',
          message: 'Password incorrect.'
        })
      }

      // Generate token
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      delete user.password

      return res.status(200).json({ token, user })
    } catch (err) {
      next(err)
    }
  },
  signup: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      if (!account?.trim() || !name?.trim() || !email?.trim() || !password?.trim() || !checkPassword?.trim()) {
        return res.status(400).json({
          status: 'error',
          message: 'All fields required.'
        })
      }

      if (name?.length > 50) {
        return res.status(400).json({
          status: 'error',
          message: "Field 'name' should be limited within 50 characters."
        })
      }

      if (password !== checkPassword) {
        return res.status(401).json({
          status: 'error',
          message: 'Password and checkPassword should be the same.'
        })
      }
      const accountExist = await User.findOne({ where: { account } })
      if (accountExist) {
        return res.status(401).json({
          status: 'error',
          message: 'Account already exists. Please try another one.'
        })
      }
      const emailExist = await User.findOne({ where: { email } })
      if (emailExist) {
        return res.status(401).json({
          status: 'error',
          message: 'Email already exists. Please try another one.'
        })
      }

      await User.create({
        account,
        name,
        email,
        password: bcrypt.hashSync(password, 10)
      })

      return res.status(200).json({
        status: 'success',
        message: 'Sign up success.'
      })
    } catch (err) {
      next(err)
    }
  },
  getUser: async (req, res, next) => {
    try {
      const id = req.params.id
      const user = await User.findByPk(id, {
        attributes: [
          'id', 'name', 'account', 'email', 'avatar', 'cover', 'introduction', 'role',
          [
            sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id)'), 'tweetCount'
          ],
          [
            sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followerId = User.id)'), 'followingCount'
          ],
          [
            sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)'), 'followerCount'
          ]
        ],
        raw: true
      })
      if (!user) return res.status(404).json({ status: 'error', message: 'User is not found' })
      return res.status(200).json(user)
    } catch (err) {
      next(err)
    }
  },
  getUserTweets: async (req, res, next) => {
    try {
      // get the tweets of a certain user (req.params.id === userId)
      const id = req.params.id
      const tweets = await Tweet.findAll({
        where: { UserId: id },
        attributes: [
          'id', 'description', 'createdAt',
          [
            sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'replyCount'
          ],
          [
            sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likeCount'
          ]
        ],
        include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })
      if (!tweets) return res.status(404).json({ status: 'error', message: 'Tweets are not found.' })

      // check if the current user likes the tweets or not (add attribute "isLike" in tweets)
      const currentUserId = helpers.getUser(req).id
      const currentUserLikedList = await Like.findAll({
        where: { UserId: currentUserId },
        raw: true
      })
      const likeTweetsIds = currentUserLikedList.map(like => like.TweetId)
      const tweetsIncludeIsLike = tweets.map(tweet => ({
        ...tweet, isLiked: likeTweetsIds.some(tweetId => tweetId === tweet.id)
      }))

      res.status(200).json(tweetsIncludeIsLike)
    } catch (err) {
      next(err)
    }
  },
  getUserReplies: async (req, res, next) => {
    try {
      // get the replies a certain user, and relating the tweet data of the reply
      const id = req.params.id
      const replies = await Reply.findAll({
        where: { UserId: id },
        attributes: ['id', 'comment', 'createdAt'],
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
          {
            model: Tweet,
            attributes: ['id'],
            include: [{
              model: User, attributes: ['id', 'name', 'account']
            }]
          }
        ],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })
      if (!replies.length) res.status(404).json({ status: 'error', message: 'Replies are not found.' })
      res.status(200).json(replies)
    } catch (err) {
      next(err)
    }
  },
  getUserLikes: async (req, res, next) => {
    try {
      const id = req.params.id
      const likes = await Like.findAll({
        where: { UserId: id },
        attributes: ['id', 'TweetId', 'createdAt'],
        include: [
          {
            model: Tweet,
            attributes: ['id', 'description', 'createdAt',
              [
                sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likeCount'
              ],
              [
                sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'replyCount'
              ]
            ],
            include: { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
          }
        ],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })
      if (!likes.length) res.status(404).json({ status: 'error', message: 'Likes are not found.' })

      // check if the current user likes the tweets or not (add attribute "isLiked" in tweets)
      const currentUserId = helpers.getUser(req).id
      const currentUserLikedList = await Like.findAll({
        where: { UserId: currentUserId },
        raw: true
      })
      const likeTweetsIds = currentUserLikedList.map(like => like.TweetId)
      const tweetsIncludeIsLike = likes.map(like => ({
        ...like, isLiked: likeTweetsIds.some(tweetId => tweetId === like.TweetId)
      }))

      res.status(200).json(tweetsIncludeIsLike)
    } catch (err) {
      next(err)
    }
  },
  getCurrentUser: async (req, res, next) => {
    const id = helpers.getUser(req).id
    const user = await User.findByPk(id, {
      attributes: ['id', 'name', 'account', 'avatar', 'email', 'role']
    })
    if (!user) return res.json({ status: 'error', message: 'user not found' })
    return res.json(user)
  }
}

module.exports = userController

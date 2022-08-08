const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sequelize = require('sequelize')
const imgurFileHandler = require('../helpers/file-helper')
const helpers = require('../_helpers')
const validator = require('validator')
const { User, Tweet, Like, Reply, Followship } = require('../models')

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

      if (!validator.isEmail(email)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid email address.'
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
      // Get query for pagination(optional)
      const limit = Number(req.query.count) || null
      const offset = (Number(req.query.page) - 1) * limit || null

      // check the user id is existing
      const id = Number(req.params.id)
      const userIsExist = await User.findByPk(id)
      if (!userIsExist) return res.status(404).json({ status: 'error', message: 'User is not found' })

      // get the tweets of a certain user
      const tweets = await Tweet.findAll({
        limit,
        offset,
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
      if (!tweets.length) return res.status(200).json([])

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
      // Get query for pagination(optional)
      const limit = Number(req.query.count) || null
      const offset = (Number(req.query.page) - 1) * limit || null

      // check the user id is existing
      const id = Number(req.params.id)
      const userIsExist = await User.findByPk(id)
      if (!userIsExist) return res.status(404).json({ status: 'error', message: 'User is not found' })

      // get the replies a certain user, and relating the tweet data of the reply
      const replies = await Reply.findAll({
        limit,
        offset,
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
      if (!replies.length) return res.status(200).json([])
      res.status(200).json(replies)
    } catch (err) {
      next(err)
    }
  },
  getUserLikes: async (req, res, next) => {
    try {
      // Get query for pagination(optional)
      const limit = Number(req.query.count) || null
      const offset = (Number(req.query.page) - 1) * limit || null

      // check the user id is existing
      const id = Number(req.params.id)
      const userIsExist = await User.findByPk(id)
      if (!userIsExist) return res.status(404).json({ status: 'error', message: 'User is not found' })

      const likes = await Like.findAll({
        limit,
        offset,
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
      if (!likes.length) return res.status(200).json([])

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
  getUserFollowings: async (req, res, next) => {
    try {
      // Get query for pagination(optional)
      const limit = Number(req.query.count) || null
      const offset = (Number(req.query.page) - 1) * limit || null

      // check the user id is existing
      const id = Number(req.params.id)
      const userIsExist = await User.findByPk(id)
      if (!userIsExist) return res.status(404).json({ status: 'error', message: 'User is not found' })

      const followings = await Followship.findAll({
        limit,
        offset,
        where: { FollowerId: id },
        attributes: ['followingId', 'createdAt',
          [
            sequelize.literal('(SELECT name FROM Users WHERE Users.id = Followship.followingId)'), 'name'
          ],
          [
            sequelize.literal('(SELECT account FROM Users WHERE Users.id = Followship.followingId)'), 'account'
          ],
          [
            sequelize.literal('(SELECT avatar FROM Users WHERE Users.id = Followship.followingId)'), 'avatar'
          ],
          [
            sequelize.literal('(SELECT introduction FROM Users WHERE Users.id = Followship.followingId)'), 'introduction'
          ]
        ],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })
      if (!followings.length) res.status(200).json([])

      // check if the current user is following the user (add attribute "isFollowing" in followings)
      const currentUserFollowingIds = helpers.getUser(req).Followings.map(f => f.id)
      const followingsData = followings.map(following => ({
        ...following,
        isFollowing: currentUserFollowingIds.includes(following.followingId),
        followId: following.followingId
      }))

      res.status(200).json(followingsData)
    } catch (err) {
      next(err)
    }
  },
  getUserFollowers: async (req, res, next) => {
    try {
      // Get query for pagination(optional)
      const limit = Number(req.query.count) || null
      const offset = (Number(req.query.page) - 1) * limit || null

      // check the user id is existing
      const id = Number(req.params.id)
      const userIsExist = await User.findByPk(id)
      if (!userIsExist) return res.status(404).json({ status: 'error', message: 'User is not found' })

      const followers = await Followship.findAll({
        limit,
        offset,
        where: { FollowingId: id },
        attributes: ['followerId', 'createdAt',
          [
            sequelize.literal('(SELECT name FROM Users WHERE Users.id = Followship.followerId)'), 'name'
          ],
          [
            sequelize.literal('(SELECT account FROM Users WHERE Users.id = Followship.followerId)'), 'account'
          ],
          [
            sequelize.literal('(SELECT avatar FROM Users WHERE Users.id = Followship.followerId)'), 'avatar'
          ],
          [
            sequelize.literal('(SELECT introduction FROM Users WHERE Users.id = Followship.followerId)'), 'introduction'
          ]
        ],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })
      if (!followers.length) return res.status(200).json([])

      // check if the current user is following the user (add attribute "isFollowing" in followings)
      const currentUserFollowingIds = helpers.getUser(req).Followings.map(f => f.id)
      const followersData = followers.map(follower => ({
        ...follower,
        isFollowing: currentUserFollowingIds.includes(follower.followerId),
        followId: follower.followerId
      }))

      res.status(200).json(followersData)
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
  },
  editUser: async (req, res, next) => {
    try {
      let { account, name, email, password, checkPassword, introduction } = req.body
      const { files } = req
      const id = Number(req.params.id)
      if (!id) return res.status(401).json({ status: 'error', message: 'Id number is not found in url request' })

      // check if the profile belongs to current user
      const currentUser = helpers.getUser(req)
      if (id !== currentUser.id) return res.status(400).json({ status: 'error', message: "Can not edit other's profile" })

      // get the user instance (full data, including hashed password)
      const user = await User.findByPk(id)

      // ===== 帳戶設定 input: account, name, email, password, checkPassword ===
      // remove whitespace of input strings
      account = account?.trim()
      name = name?.trim()
      email = email?.trim()
      password = password?.trim()
      checkPassword = checkPassword?.trim()

      // check if the account is changed. If yes, check if the new account has been registered
      if (account) {
        if (account !== user.account) {
          const accountExist = await User.findOne({ where: { account } })
          if (accountExist) return res.status(401).json({ status: 'error', message: 'The account is registered.' })
        }
      }
      // check if updated name > 50
      if (name?.length > 50) return res.status(400).json({ status: 'error', message: 'Name is too long.' })
      // check if email is changed. If yes, check if the new email is valid and not registered
      if (email) {
        if (!validator.isEmail(email)) return res.status(400).json({ status: 'error', message: 'Invalid email address.' })
        if (email !== user.email) {
          const emailExist = await User.findOne({ where: { email } })
          if (emailExist) return res.status(401).json({ status: 'error', message: 'The email is registered.' })
        }
      }
      // check if the password and checkPassword are the same
      if (password !== checkPassword) return res.status(401).json({ status: 'error', message: 'Password and checkPassword are not same.' })

      // update user data
      const updatedUserSetting = await user.update({
        account: account || user.account,
        name: name || user.name,
        email: email || user.email,
        password: password ? bcrypt.hashSync(password, 10) : user.password
      })

      // ===== 編輯個人資料 input: name(上面檢查更新過了), introduction, files ===
      // check if introduction > 160 characters
      if (introduction?.length > 160) return res.status(400).json({ status: 'error', message: 'Introduction is too long.' })

      // check if the user uploads new files. If yes, handle the image with the helper and get the link(str)
      let avatar = files?.avatar || null
      if (avatar) { avatar = await imgurFileHandler(avatar[0]) }
      let cover = files?.cover || null
      if (cover) { cover = await imgurFileHandler(cover[0]) }

      // update user data
      const updatedUserProfile = await updatedUserSetting.update({
        introduction: introduction,
        avatar: avatar || user.avatar,
        cover: cover || user.cover
      })
      const data = updatedUserProfile.toJSON()
      delete data.password
      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController

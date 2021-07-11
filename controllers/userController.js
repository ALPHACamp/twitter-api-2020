const db = require('../models')
const { User, Tweet, Reply, Like, Followship } = db
const validator = require('validator')
const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const uploadImg = path => {
  return new Promise((resolve, reject) => {
    imgur.upload(path, (err, img) => {
      if (err) {
        return reject('error happened')
      }
      resolve(img)
    })
  })
}

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const userController = {
  signIn: async (req, res) => {
    // #swagger.tags = ['SignUp/Signin']
    try {
      // check all inputs are required
      const { account, password } = req.body
      if (!account || !password) {
        return res.status(422).json({ status: 'error', message: 'All fields are required!' })
      }
      const user = await User.findOne({ where: { account } })
      if (!user) return res.status(401).json({ status: 'error', message: 'That account is not registered!' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: 'Account or Password incorrect.' })
      }
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.status(200).json({
        status: 'success',
        message: 'Sign in successfully.',
        token: token,
        user: {
          id: user.id,
          account: user.account,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          cover: user.cover,
          role: user.role
        }
      })
    } catch (err) {
      console.log(err)
      res.status(500).json({ status: 'error', message: 'error' })
    }
  },
  signUp: async (req, res) => {
    // #swagger.tags = ['SignUp/Signin']
    try {
      const { account, name, email, password, checkPassword } = req.body
      const message = []
      // check all inputs are required
      if (!account || !name || !email || !password || !checkPassword) {
        message.push('All fields are required！')
      }
      // check name length and type
      if (name && !validator.isByteLength(name, { min: 0, max: 50 })) {
        message.push('Name can not be longer than 50 characters.')
      }
      // check account length and type
      if (account && !validator.isByteLength(account, { min: 0, max: 20 })) {
        message.push('Account can not be longer than 20 characters.')
      }
      // check email validation
      if (email && !validator.isEmail(email)) {
        message.push(`${email} is not a valid email address.`)
      }
      // check password length and type
      if (password && !validator.isByteLength(password, { min: 5, max: 15 })) {
        message.push('Password does not meet the required length.')
      }
      // check password and checkPassword
      if (password && (password !== checkPassword)) {
        message.push('The password and confirmation do not match.Please retype them.')
      }
      const [inputEmail, inputAccount] = await Promise.all([User.findOne({ where: { email } }), User.findOne({ where: { account } })])
      if (inputEmail) {
        message.push('This email address is already being used.')
      }
      if (inputAccount) {
        message.push('This account is already being used.')
      }
      if (message.length) {
        return res.status(400).json({ status: 'error', message })
      }
      await User.create({
        account,
        name,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
      })
      return res.status(200).json({ status: 'success', message: `@${account} sign up successfully.Please sign in.` })
    } catch (err) {
      console.log(err)
      res.status(500).json({ status: 'error', message: 'error' })
    }
  },
  getCurrentUser: (req, res) => {
    // #swagger.tags = ['Users']
    return res.status(200).json({
      id: req.user.id,
      name: req.user.name,
      account: req.user.account,
      email: req.user.email,
      avatar: req.user.avatar,
      role: req.user.role,
      cover: req.user.cover,
      introduction: req.user.introduction
    })
  },
  getTopUsers: async (req, res) => {
    // #swagger.tags = ['Users']
    try {
      let users = await User.findAll({
        where: { role: 'user' },
        include: [
          { model: User, as: 'Followers' }
        ],
        limit: 10
      })
      if (!users) {
        return res.status(404).json({ status: 'error', message: 'Cannot find any user in db.' })
      }
      users = users.map(user => ({
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        account: user.account,
        followerCount: user.Followers.length,
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
      }))
      users = users.sort((a, b) => b.followerCount - a.followerCount)
      return res.status(200).json({
        status: 'success',
        message: 'Get top ten users successfully',
        users
      })
    } catch (err) {
      console.log(err)
      res.status(500).json({ status: 'error', message: 'error' })
    }
  },
  editAccount: async (req, res) => {
    // #swagger.tags = ['Users']
    try {
      const { account, name, email, password, checkPassword } = req.body
      const { email: currentEmail, account: currentAccount } = req.user
      const id = req.params.id
      // only user himself allow to edit account
      if (req.user.id !== Number(id)) {
        return res.status(401).json({ status: 'error', message: 'Permission denied.' })
      }
      // check this user is or not in db
      const user = await User.findByPk(id)
      if (!user || user.role === 'admin') {
        return res.status(404).json({ status: 'error', message: 'Cannot find this user in db.' })
      }
      const message = []
      // check all inputs are required
      if (!account || !name || !email || !password || !checkPassword) {
        message.push('All fields are required！')
      }
      // check name length and type
      if (name && !validator.isByteLength(name, { min: 0, max: 50 })) {
        message.push('Name can not be longer than 50 characters.')
      }
      // check account length and type
      if (account && !validator.isByteLength(account, { min: 0, max: 20 })) {
        message.push('Account can not be longer than 20 characters.')
      }
      // check email validation
      if (email && !validator.isEmail(email)) {
        message.push(`${email} is not a valid email address.`)
      }
      // check password length and type
      if (password && !validator.isByteLength(password, { min: 5, max: 15 })) {
        message.push('Password does not meet the required length.')
      }
      // check password and checkPassword
      if (password && (password !== checkPassword)) {
        message.push('The password and confirmation do not match.Please retype them.')
      }
      if (email !== currentEmail) {
        const userEmail = await User.findOne({ where: { email } })
        if (userEmail) {
          message.push('This email address is already being used.')
        }
      }
      if (account !== currentAccount) {
        const userAccount = await User.findOne({ where: { account } })
        if (userAccount) {
          message.push('This account is already being used.')
        }
      }
      if (message.length) {
        return res.status(400).json({ status: 'error', message })
      }
      await user.update({ name, password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)), email, account })
      return res.status(200).json({ status: 'success', message: `@${account} Update account information successfully.` })
    } catch (err) {
      console.log(err)
      res.status(500).json({ status: 'error', message: 'error' })
    }
  },
  getUser: async (req, res) => {
    // #swagger.tags = ['Users']
    try {
      const id = req.params.id
      const user = await User.findOne({
        where: {
          id: id
        },
        include: [
          { model: Tweet },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })
      if (!user || user.role === 'admin') {
        return res.status(404).json({ status: 'error', message: 'Cannot find this user in db.' })
      }
      const data = {
        status: 'success',
        message: `Get @${user.account}'s  profile successfully.`,
        id: user.dataValues.id,
        name: user.dataValues.name,
        account: user.account,
        email: user.email,
        avatar: user.avatar,
        cover: user.cover,
        introduction: user.introduction,
        tweetCount: user.Tweets.length,
        followerCount: user.Followers.length,
        followingCount: user.Followings.length,
        isFollowed: user.Followers.map(d => d.id).includes(req.user.id)
      }
      return res.status(200).json(
        data
      )
    } catch (err) {
      console.log(err)
      res.status(500).json({ status: 'error', message: 'error' })
    }
  },
  editUserProfile: async (req, res) => {
    // #swagger.tags = ['Users']
    try {
      const id = req.params.id
      const { name, introduction } = req.body
      const message = []
      // only user himself allow to edit account
      if (req.user.id !== Number(id)) {
        return res.status(401).json({ status: 'error', message: 'Permission denied.' })
      }
      // check this user is or not in db
      const user = await User.findByPk(id)
      if (!user || user.role === 'admin') {
        return res.status(404).json({ status: 'error', message: 'Cannot find this user in db.' })
      }
      // check Name is required
      if (!name) {
        message.push('Name is required.')
      }
      // check name length and type
      if (name && !validator.isByteLength(name, { min: 0, max: 50 })) {
        message.push('Name can not be longer than 50 characters.')
      }
      // check introduction length and type
      if (introduction && !validator.isByteLength(introduction, { min: 0, max: 160 })) {
        message.push('Introduction can not be longer than 160 characters.')
      }
      if (message.length) {
        return res.status(400).json({ status: 'error', message })
      }
      const updateData = { name, introduction }
      const { files } = req
      const imgType = ['.jpg', '.jpeg', '.png']
      if (files) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        for (const file in files) {
          const index = files[file][0].originalname.lastIndexOf('.')
          const fileType = files[file][0].originalname.slice(index)
          if (imgType.includes(fileType)) {
            const img = await uploadImg(files[file][0].path)
            updateData[file] = img.data.link
          } else {
            return res.status(400).json({ status: 'error', message: `Image type of ${file} should be .jpg, .jpeg, .png .` })
          }
        }
      }
      await user.update(updateData)
      return res.status(200).json({ status: 'success', message: `Update ${name}'s profile successfully.` })
    } catch (err) {
      console.log(err)
      res.status(500).json({ status: 'error', message: 'error' })
    }
  },

  getUserTweets: async (req, res) => {
    // #swagger.tags = ['Users']
    try {
      const UserId = req.params.id
      const user = await User.findByPk(UserId)
      if (!user || user.role === 'admin') {
        return res.status(404).json({ status: 'error', message: 'Cannot find this user in db.' })
      }

      let tweets = await Tweet.findAll({
        where: { UserId },
        include: [
          User,
          Reply,
          Like,
          { model: User, as: 'LikedUsers' }
        ],
        order: [['createdAt', 'DESC']]
      })
      if (!tweets) {
        return res.status(404).json({ status: 'error', message: 'Cannot find any tweets in db.' })
      }
      tweets = tweets.map(tweet => {
        return {
          id: tweet.id,
          UserId: tweet.UserId,
          description: tweet.description,
          createdAt: tweet.createdAt,
          account: tweet.User.account,
          name: tweet.User.name,
          avatar: tweet.User.avatar,
          likedCount: tweet.Likes.length,
          repliedCount: tweet.Replies.length,
          isLike: tweet.LikedUsers.map(t => t.id).includes(req.user.id)
        }
      })
      return res.status(200).json(tweets)
    } catch (err) {
      console.log(err)
      res.status(500).json({ status: 'error', message: 'error' })
    }
  },

  getUserReplies: async (req, res) => {
    // #swagger.tags = ['Users']
    try {
      const UserId = req.params.id
      const user = await User.findByPk(UserId)
      if (!user || user.role === 'admin') {
        return res.status(404).json({ status: 'error', message: 'Cannot find this user in db.' })
      }

      let replies = await Reply.findAll({
        where: { UserId },
        include: [User, { model: Tweet, include: User }],
        order: [['createdAt', 'DESC']]
      })
      if (!replies) {
        return res.status(404).json({ status: 'error', message: 'Cannot find any replies in db.' })
      }
      replies = replies.map(reply => {
        return {
          id: reply.id,
          UserId: reply.UserId,
          TweetId: reply.TweetId,
          tweetAuthorAccount: reply.Tweet.User.account,
          comment: reply.comment,
          createdAt: reply.createdAt,
          commentAccount: reply.User.account,
          name: reply.User.name,
          avatar: reply.User.avatar
        }
      })
      return res.status(200).json(replies)
    } catch (err) {
      console.log(err)
      res.status(500).json({ status: 'error', message: 'error' })
    }
  },

  getUserLikes: async (req, res) => {
    // #swagger.tags = ['Users']
    try {
      const UserId = req.params.id
      const user = await User.findByPk(UserId)
      if (!user || user.role === 'admin') {
        return res.status(404).json({ status: 'error', message: 'Cannot find this user in db.' })
      }
      let likes = await Like.findAll({
        where: { UserId },
        include: [{
          model: Tweet,
          include: [{ model: User },
            { model: Reply, include: [{ model: User }] }, Like]
        }],
        order: [['createdAt', 'DESC']]
      })
      likes = likes.map(like => {
        return {
          id: like.id,
          UserId: like.UserId,
          TweetId: like.TweetId,
          likeCreatedAt: like.createdAt,
          account: like.Tweet.User.account,
          name: like.Tweet.User.name,
          avatar: like.Tweet.User.avatar,
          description: like.Tweet.description,
          tweetCreatedAt: like.Tweet.createdAt,
          likedCount: like.Tweet.Likes.length,
          repliedCount: like.Tweet.Replies.length,
          isLike: like.Tweet.Likes.some((t) => t.UserId === req.user.id)
        }
      })
      return res.status(200).json(likes)
    } catch (err) {
      console.log(err)
      res.status(500).json({ status: 'error', message: 'error' })
    }
  },

  getUserFollowings: async (req, res) => {
    // #swagger.tags = ['Users']
    try {
      let user = await User.findByPk(req.params.id,
        {
          include: [
            { model: User, as: 'Followings' }],
          order: [['Followings', Followship, 'createdAt', 'DESC']]
        })
      if (!user || user.role === 'admin') {
        return res.status(404).json({ status: 'error', message: 'Cannot find this user in db.' })
      }
      if (!user.Followings.length) {
        return res.status(200).json({ message: `@${user.account} has no following.` })
      }

      user = user.Followings.map(following => ({
        followingId: following.id,
        account: following.account,
        name: following.name,
        avatar: following.avatar,
        introduction: following.introduction,
        followshipCreatedAt: following.Followship.createdAt,
        isFollowed: helpers.getUser(req).Followings.map(f => f.id).includes(following.id)
      }))
      return res.status(200).json(user)
    } catch (err) {
      console.log(err)
      res.status(500).json({ status: 'error', message: 'error' })
    }
  },
  getUserFollowers: async (req, res) => {
    // #swagger.tags = ['Users']
    try {
      let user = await User.findByPk(req.params.id,
        {
          include: [
            { model: User, as: 'Followers' }
          ],
          order: [['Followers', Followship, 'createdAt', 'DESC']]
        })
      if (!user || user.role === 'admin') {
        return res.status(404).json({ status: 'error', message: 'Cannot find this user in db.' })
      }
      if (!user.Followers.length) {
        return res.status(200).json({ message: `@${user.account} has no follower.` })
      }
      user = user.Followers.map(follower => ({
        followerId: follower.id,
        account: follower.account,
        name: follower.name,
        avatar: follower.avatar,
        introduction: follower.introduction,
        followshipCreatedAt: follower.Followship.createdAt,
        isFollowed: helpers.getUser(req).Followings.map(f => f.id).includes(follower.id)
      }))
      return res.status(200).json(user)
    } catch (err) {
      console.log(err)
      res.status(500).json({ status: 'error', message: 'error' })
    }
  }
}

module.exports = userController

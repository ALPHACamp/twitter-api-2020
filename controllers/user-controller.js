const jwt = require('jsonwebtoken')
const { User, Tweet, Reply, Like } = require('../models')
const bcrypt = require('bcryptjs')
const { imgurFileHandler } = require('../helpers/file-helpers')
const helpers = require('../_helpers')

const userController = {
  signIn: (req, res, next) => {
    try {
      const user = helpers.getUser(req)
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '14d' })
      res.json({
        status: 'success',
        token
      })
    } catch (err) {
      next(err)
    }
  },
  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      if (!account || !name || !email || !password || !checkPassword) throw new Error('All fields are required')
      if (password !== checkPassword) throw new Error(`"password" and "checkPassword" not matched`)
      if (account.length > 20) throw new Error('Characters length of account should be less than 20')
      if (name.length > 50) throw new Error('Characters length of name should be less than 50')
      const [userAccount, userEmail] = await Promise.all([
        User.findOne({ where: { account } }),
        User.findOne({ where: { email } })
      ])
      if (userAccount) throw new Error('The account has already been used by someone else.')
      if (userEmail) throw new Error('The email has already been used by someone else.')
      await User.create({
        account,
        name,
        email,
        password: bcrypt.hashSync(password, 10)
      })
      res.json({ status: 'success' })
    } catch (err) {
      next(err)
    }
  },
  getSetting: async (req, res, next) => {
    try {
      if (Number(req.params.id) !== helpers.getUser(req).id) return res.status(403).json({ status: 'error', message: 'permission denied' })
      const user = await User.findByPk(req.params.id, { raw: true })
      if (!user) throw new Error('Target user not exist')
      delete user.password
      res.json(user)
    } catch (err) {
      next(err)
    }
  },
  patchSetting: async (req, res, next) => {
    try {
      if (Number(req.params.id) !== helpers.getUser(req).id) return res.status(403).json({ status: 'error', message: 'permission denied' })
      const { account, name, email, password, checkPassword } = req.body
      const text = !account ? Object.keys({account})[0] : !name ? Object.keys({name})[0] : !email ? Object.keys({email})[0] : null  
      if (text) throw new Error(`${text} field is required`)
      if (name.length > 50) throw new Error('Characters length of name should be less than 50.')
      if ((password || checkPassword) && password !== checkPassword) throw new Error(`"password" and "checkPassword" not matched`)
      const [user, userAccount, userEmail] = await Promise.all([
        User.findByPk(req.params.id),
        User.findOne({ where: { account } }),
        User.findOne({ where: { email } })
      ])
      if (userAccount && user.id !== userAccount.id) throw new Error('The account has already been used by someone else.')
      if (userEmail && user.id !== userEmail.id) throw new Error('The email has already been used by someone else.')
      await user.update({
        account,
        name,
        email,
        password: password ? bcrypt.hashSync(password, 10) : user.toJSON().password
      })
      res.json({ status: 'success' })
    } catch (err) {
      next(err)
    }
  },
  getUser: async (req, res, next) => {
    try {
      const userFind = await User.findByPk(req.params.id, {
        include: [
          Tweet,
          Reply,
          Like,
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ] 
      })
      if (!userFind || userFind.role !== 'user') throw new Error('Target user not exist')
      const { email, password, Tweets, Replies, Likes, Followers, Followings, ...restProps } = {
        ...userFind.toJSON(),
        tweetCounts: userFind.Tweets.length,
        replyCounts: userFind.Replies.length,
        likeCounts: userFind.Likes.length,
        followerCounts: userFind.Followers.length,
        followingCounts: userFind.Followings.length
      }
      res.json({
        ...restProps
      })
    } catch (err) {
      next(err)
    }
  },
    putUser: async (req, res, next) => {
    try {
      if (Number(req.params.id) !== helpers.getUser(req).id) return res.status(403).json({ status: 'error', message: 'permission denied' })
      const userFind = await User.findByPk(req.params.id)
      if (!userFind) throw new Error('Target user not exist')
      const { name, introduction } = req.body
      if (!name) throw new Error('name field is required')
      if (name.length > 50) throw new Error('Characters length of name should be less than 50.')
      if (introduction && introduction.length > 160) throw new Error('Characters length of introduction should be less than 160.')
      const avatarPath = req.files?.avatar ? await imgurFileHandler(req.files.avatar[0]) : userFind.avatar
      const bannerPath = req.files?.banner ? await imgurFileHandler(req.files.banner[0]) : userFind.banner
      await userFind.update({
        name,
        introduction,
        avatar: avatarPath,
        banner: bannerPath
      })
      res.json({ status: 'success' })
    } catch (err) {
      next(err)
    }
  },
  getUserTweets: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id)
      if (!user || user.role !== 'user') throw new Error('Target user not exist')
      const tweets = await Tweet.findAll({
        where: { UserId: req.params.id },
        include: [Reply, Like] 
      })
      const tweetsSort = tweets
        .map(tweet => {
          const { Replies, Likes, ...restProps } = {
            ...tweet.toJSON(),
            replyCounts: tweet.Replies.length,
            likeCounts: tweet.Likes.length
          }
          return restProps
        })
        .sort((a, b) => b.createAt - a.createAt)
      res.json(tweetsSort)
    } catch (err) {
      next(err)
    }
  },
  getUserReplies: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id)
      if (!user || user.role !== 'user') throw new Error('Target user not exist')
      const replies = await Reply.findAll({
        where: { UserId: req.params.id },
        include: [{ model: Tweet, include: User }] 
      })
      const repliesSort = replies
        .map(reply => {
          const { Tweet, ...restProps } = {
            ...reply.toJSON(),
            replyUserAccount: reply.Tweet.User.account
          }
          return restProps
        })
        .sort((a, b) => b.createAt - a.createAt)
      res.json(repliesSort)
    } catch (err) {
      next(err)
    }
  },
  getUserLikes: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id)
      if (!user || user.role !== 'user') throw new Error('Target user not exist')
      const likes = await Like.findAll({
        where: { UserId: req.params.id },
        include: [{ model: Tweet, include: [User, Reply, Like] }] 
      })
      const likesSort = likes
        .map(like => {
          const {User, Replies, Likes, ...restProps } = {
            ...like.Tweet.toJSON(),
            replyUserAccount: like.Tweet.User.account,
            replyCounts: like.Tweet.Replies.length,
            likeCounts: like.Tweet.Likes.length
          }
          const likeReturn = {
            ...like.toJSON(),
            Tweet: restProps
          }
          return likeReturn
        })
        .sort((a, b) => b.createAt - a.createAt)
      res.json(likesSort)
    } catch (err) {
      next(err)
    }
  },
  getUserFollowings: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, {
        include: [
          { model: User, as: 'Followings' }
        ]
      })
      if (!user || user.role !== 'user') throw new Error('Target user not exist')
      const followingSort = user.Followings
        .map(user => {
          const { id, email, password, banner, ...restProps } = user.toJSON()
          restProps.followingId = user.id
          return restProps
        })
        .sort((a, b) => b.createAt - a.createAt)
      res.json(followingSort)
    } catch (err) {
      next(err)
    }
  },
  getUserFollowers: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, {
        include: [
          { model: User, as: 'Followers', include: { model: User, as: 'Followers' } }
        ]
      })
      if (!user || user.role !== 'user') throw new Error('Target user not exist')
      const followerSort = user.Followers
        .map(follower => {
          const { id, email, password, banner, ...restProps } = follower.toJSON()
          restProps.isFollowing = follower.Followers.some(one => one.id === req.params.id)
          restProps.followerId = follower.id
          return restProps
        })
        .sort((a, b) => b.createAt - a.createAt)
      res.json(followerSort)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
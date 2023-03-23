const jwt = require('jsonwebtoken')
const { User, Tweet, Reply, Like } = require('../models')
const bcrypt = require('bcryptjs')
const { imgurFileHandler } = require('../helpers/file-helpers')
const helpers = require('../_helpers')

const userController = {
  // feature: user can sign in
  // route: POST /api/users/signin
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
  // feature: user can register an account
  // route: POST /api/users
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
  // feature: user can see his or her own registered data
  // route: GET /api/users/setting
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
  // feature: user can edit his or her own registered data
  // route: PATCH /api/users/setting
  patchSetting: async (req, res, next) => {
    try {
      if (Number(req.params.id) !== helpers.getUser(req).id) return res.status(403).json({ status: 'error', message: 'permission denied' })
      const { account, name, email, password, checkPassword } = req.body
      const text = !account ?
        Object.keys({account})[0] : !name ?
        Object.keys({name})[0] : !email ?
        Object.keys({email})[0] : null
      if (text) throw new Error(`${text} field is required`)
      if (name.length > 50) throw new Error('Characters length of name should be less than 50.')
      if ((password || checkPassword) && (password !== checkPassword)) throw new Error(`"password" and "checkPassword" not matched`)
      const [user, userAccount, userEmail] = await Promise.all([
        User.findByPk(req.params.id),
        User.findOne({ where: { account } }),
        User.findOne({ where: { email } })
      ])
      if (userAccount && (user.id !== userAccount.id)) throw new Error('The account has already been used by someone else.')
      if (userEmail && (user.id !== userEmail.id)) throw new Error('The email has already been used by someone else.')
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
  // feature: user can see his or her own profile data
  // route: GET /api/users/:id
  getUser: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req)?.id
      const userFind = await User.findByPk(req.params.id, {
        attributes: {
          exclude: ['email', 'password', 'createdAt', 'updatedAt']
        },
        include: [
          Tweet,
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ],
        nest: true
      })
      if (!userFind || (userFind.role !== 'user')) throw new Error('Target user not exist')
      const { Tweets, Followers, Followings, ...restProps } = {
        ...userFind.toJSON(),
        tweetCounts: userFind.Tweets.length,
        followerCounts: userFind.Followers.length,
        followingCounts: userFind.Followings.length,
        isFollowed: userFind.Followers.some(follower => follower.id === currentUserId)
      }
      res.json({
        ...restProps
      })
    } catch (err) {
      next(err)
    }
  },
  // feature: user can edit his or her own profile data
  // route: PUT /api/users/:id
  putUser: async (req, res, next) => {
    try {
      if (Number(req.params.id) !== helpers.getUser(req).id) return res.status(403).json({ status: 'error', message: 'permission denied' })
      const userFind = await User.findByPk(req.params.id)
      if (!userFind) throw new Error('Target user not exist')
      const { name, introduction } = req.body
      if (!name) throw new Error('name field is required')
      if (name.length > 50) throw new Error('Characters length of name should be less than 50.')
      if (introduction && (introduction.length > 160)) throw new Error('Characters length of introduction should be less than 160.')
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
  // feature: user can see all tweets that the specific user posted
  // route: GET /api/users/:id/tweets
  getUserTweets: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const user = await User.findByPk(req.params.id)
      if (!user || (user.role !== 'user')) throw new Error('Target user not exist')
      const tweets = await Tweet.findAll({
        where: { UserId: req.params.id },
        include: [Reply, Like]
      })
      const tweetsSort = tweets
        .map(tweet => {
          const { Replies, Likes, ...restProps } = {
            ...tweet.toJSON(),
            replyCounts: tweet.Replies.length,
            likeCounts: tweet.Likes.length,
            isLiked: tweet.Likes.some(like => like.UserId === currentUserId)
          }
          return restProps
        })
        .sort((a, b) => b.createdAt - a.createdAt)
      res.json(tweetsSort)
    } catch (err) {
      next(err)
    }
  },
  // feature: get all replies of the specific user
  // route: GET /api/users/:id/replied_tweets
  getUserReplies: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id)
      if (!user || (user.role !== 'user')) throw new Error('Target user not exist')
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
        .sort((a, b) => b.createdAt - a.createdAt)
      res.json(repliesSort)
    } catch (err) {
      next(err)
    }
  },
  // feature: user can see all tweets that the specific user liked
  // route: GET /api/users/:id/likes
  getUserLikes: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id)
      if (!user || (user.role !== 'user')) throw new Error('Target user not exist')
      const likes = await Like.findAll({
        where: { UserId: req.params.id },
        include: [{ model: Tweet, include: [User, Reply, Like] }]
      })
      const likesSort = likes
        .map(like => {
          const { id, name, account, avatar } = like.Tweet.User.toJSON()
          const { Replies, Likes, UserId, ...restProps } = {
            ...like.Tweet.toJSON(),
            User: { id, name, account, avatar},
            replyCounts: like.Tweet.Replies.length,
            likeCounts: like.Tweet.Likes.length
          }
          const likeReturn = {
            ...like.toJSON(),
            Tweet: restProps
          }
          return likeReturn
        })
        .sort((a, b) => b.createdAt - a.createdAt)
      res.json(likesSort)
    } catch (err) {
      next(err)
    }
  },
  // feature: user can see all people that the specific user is following
  // route: GET /api/:id/followings
  getUserFollowings: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const user = await User.findByPk(req.params.id, {
        include: [
          { model: User, as: 'Followings', include: { model: User, as: 'Followers' } }
        ]
      })
      if (!user || (user.role !== 'user')) throw new Error('Target user not exist')
      const followingSort = user.Followings
        .map(following => {
          const { email, password, banner, Followship, Followers, ...restProps } = following.toJSON()
          restProps.isFollowed = following.Followers.some(one => one.Followship.followerId === currentUserId)
          restProps.followingId = following.Followship.followingId
          return restProps
        })
        .sort((a, b) => b.createdAt - a.createdAt)
      res.json(followingSort)
    } catch (err) {
      next(err)
    }
  },
  // feature: user can see the specific user’s all followers
  // route: GET /api/:id/followers
  getUserFollowers: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const user = await User.findByPk(req.params.id, {
        include: [
          { model: User, as: 'Followers', include: { model: User, as: 'Followers' } }
        ]
      })
      if (!user || (user.role !== 'user')) throw new Error('Target user not exist')
      const followerSort = user.Followers
        .map(follower => {
          const { email, password, banner, Followship, Followers, ...restProps } = follower.toJSON()
          restProps.isFollowed = follower.Followers.some(one => one.Followship.followerId === currentUserId)
          restProps.followerId = follower.Followship.followerId
          return restProps
        })
        .sort((a, b) => b.createdAt - a.createdAt)
      res.json(followerSort)
    } catch (err) {
      next(err)
    }
  },
  // feature: get current user's data
  // route: GET /api/get_current_user
  getCurrentUser: async (req, res, next) => {
    try {
      const { Followers, Followings, ...currentUser } = helpers.getUser(req)
      res.json({
        ...currentUser
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController

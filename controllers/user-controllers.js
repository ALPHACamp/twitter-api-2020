const helpers = require('../_helpers');
const bcrypt = require('bcryptjs')
const { imgurFileHandler } = require('../helpers/file-helpers')
const jwt = require("jsonwebtoken");
const { reporters } = require('mocha')
const { User, Tweet, Reply, Like, Followship } = require('../models')


const userController = {
  login: (req, res, next) => {
    const errData = req.user.data;
    try {
      if (!errData) {
        const userData = req.user.toJSON();
        if (userData.role === 'user') {
          delete userData.password;
          const token = jwt.sign(userData, process.env.JWT_SECRET, {
            expiresIn: "30d",
          }); // 簽發 JWT，效期為 30 天
          res.json({
            status: "success",
            data: {
              token,
              user: userData,
            }
          });
        } else { res.json({ status: 'error', message: 'This is for normal user!' }) }

      } else {
        res.json(errData);
      }
    } catch (err) {
      next(err);
    }
  },

  getCurrentUser: async (req, res, next) => {
    const DEFAULT_COUNT = 0
    const currentUser = helpers.getUser(req)
    const count = {}
    try {
      const user = await User.findByPk(currentUser.id, {
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
          { model: Like },
          { model: Tweet },
          { model: Reply }
        ]
      })

      count.tweetCount = user.Tweets.length || DEFAULT_COUNT
      count.likedCount = user.Likes.length || DEFAULT_COUNT
      count.repliedCount = user.Replies.length || DEFAULT_COUNT
      count.followerCount = user.Followers.length || DEFAULT_COUNT
      count.followingCount = user.Followings.length || DEFAULT_COUNT


      return res.json({ status: 'success', user, count })
        .then(() => res.json({ status: 'success' }))
    } catch (err) { next(err) }
  },

  signUp: async (req, res, next) => {
    const account = req.body.account.trim() || null
    const password = req.body.password.trim() || null
    const checkPassword = req.body.checkPassword.trim() || null
    const name = req.body.name.trim() || null
    const email = req.body.email.trim() || null
    if (!account || !password || !checkPassword || !name || !email) return res.json({ status: 'error', message: 'All fields are required!' })
    if (name.length > 50) return res.json({ status: 'error', message: 'Name is too long!' })
    if (password !== checkPassword) return res.json({ status: 'error', message: 'Passwords do not match!' })

    try {
      const userEmail = await User.findOne({ where: { email } })
      const userAccount = await User.findOne({ where: { account } })
      if (userEmail) return res.json({ status: 'error', message: 'Email already existed!' })
      if (userAccount) return res.json({ status: 'error', message: 'Account already existed!' })
      return bcrypt.hash(req.body.password, 10)
        .then(hash =>
          User.create({
            name,
            account,
            email,
            password: hash,
            isAdmin: false,
            role: 'user'
          }))
        .then(() => {
          {
            res.json({ status: 'success' })
          }
        })
    } catch (err) { next(err) }
  },

  getUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, {
        include: [
          { model: Tweet },
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' }
        ]
      })
      if (!user) return res.json({ status: 'error', message: "User didn't exist!" })
      const { account, name, email, introduction, avatar, cover } = user
      const isFollowing = user.Followers.some(f => f.id === req.user.id)
      return res.json({ 
        account,
        name,
        email,
        introduction,
        avatar,
        cover,
        tweetCount: user.Tweets.length,
        followingCount: user.Followings.length,
        followerCount: user.Followers.length,
        isFollowing
      })
    } catch (err) {
      next(err)
    }
  },

  getUserTweets: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, {
        include: [
          { model: Tweet, include: [Reply, Like] }
        ]
      })
      if (!user) return res.json({ status: 'error', message: "User didn't exist!" })
      const result = user.Tweets.map(tweet => {
        return {
          tweetUserId: user.id,
          tweetUserAccount: user.account,
          tweetUserName: user.name,
          avatar: user.avatar,
          TweetId: tweet.id,
          description: tweet.description,
          createdAt: tweet.createdAt,
          repliedCount: tweet.Replies.length,
          likeCount: tweet.Likes.length,
          liked: req.user.LikedTweets ? req.user.LikedTweets.some(l => l.id === tweet.id) : false
        }
      })
        .sort((a, b) => b.createdAt - a.createdAt)
      return res.json(result)
    } catch (err) {
      next(err)
    }
  },

  getTopUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        include: {
          model: User, as: 'Followers'
        }
      })
      const result = users
        .map(user => ({
          id: user.id,
          name: user.name,
          account: user.account,
          avatar: user.avatar,
          followerCount: user.Followers.length,
          isFollowing: req.user.Followings.some(f => f.id === user.id)
        }))
        .sort((a, b) => b.followerCount - a.followerCount)
        .slice(0, 10)

      return res.json(result)
    } catch (err) {
      next(err)
    }
  },

  userFollowings: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id)
      if (!user) return res.json({ status: 'error', message: "User didn't exist!" })
      const targetUser = await User.findByPk(req.params.id,
        {
          include: [{ model: User, as: 'Followings' }]
        })

      const userFollowings = targetUser.Followings.map(following => {
        return {
          followingId: following.id,
          name: following.name,
          account: following.account,
          introduction: following.introduction,
          avatar: following.avatar,
          createdAt: following.createdAt,
          isFollowing: req.user.Followings ? req.user.Followings.some(f => f.id === following.id) : false
        }
      })
        .sort((a, b) => b.createdAt - a.createdAt)

      if (userFollowings.length === 0) {
        return res.json(userFollowings)
      }
      return res.json(userFollowings)
    } catch (err) {
      next(err)
    }
  },

  userFollowers: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id,
        {
          include: [{ model: User, as: 'Followers' }]
        })
      if (!user) {
        return res.json({ status: 'error', message: "User didn't exist!" })
      }
      const userFollowers = user.Followers.map(follower => {
        return {
          followerId: follower.id,
          name: follower.name,
          account: follower.account,
          introduction: follower.introduction,
          avatar: follower.avatar,
          createdAt: follower.createdAt,
          isFollowing: req.user.Followings ? req.user.Followings.some(f => f.id === follower.id) : false
        }
      })
        .sort((a, b) => b.createdAt - a.createdAt)

      return res.json(userFollowers)
    } catch (err) {
      next(err)
    }
  },

  getReliedTweets: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id)
      if (!user) {
        return res.json({ status: 'error', message: "User didn't exist!" })
      }
      const replies = await Reply.findAll({
        where: { UserId: req.params.id },
        order: [['createdAt', 'DESC']],
        include: [
          { model: Tweet, include: User }
        ]
      })
      const result = replies.map(reply => {
        const repliedTweet = reply.Tweet

        return {
          commentId: reply.id,
          comment: reply.comment,
          tweetId: repliedTweet.id,
          description: repliedTweet.description,
          createdAt: repliedTweet.createdAt,
          tweetUserId: repliedTweet.User.id,
          tweetUserName: repliedTweet.User.name,
          tweetUserAccount: repliedTweet.User.account,
          tweetUserAvatar: repliedTweet.User.avatar,
          liked: req.user.LikedTweets ? req.user.LikedTweets.some(l => l.id === repliedTweet.id) : false,
          replyUserId: user.id,
          replyUserAccount: user.account,
          replyUserName: user.name,
          replyUserAvatar: user.avatar,
          replyTime: reply.createdAt
        }
        
      })
      return res.json(result)
    } catch (err) {
      next(err)
    }
  },

  getLikes: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id)
      if (!user) return res.json({ status: 'error', message: "User didn't exist!" })
      const likes = await Like.findAll({
        where: { UserId: req.params.id },
        order: [['createdAt', 'DESC']],
        include: [{ model: Tweet, include: [User, Like, Reply] }]
      })

      const result = likes.map(like => {
        const tweet = like.Tweet
        return {
          likeCreatedAt: like.createdAt,
          TweetId: tweet.id,
          description: tweet.description,
          createdAt: tweet.createdAt,
          tweetUserId: tweet.User.id,
          tweetUserName: tweet.User.name,
          tweetUserAccount: tweet.User.account,
          avatar: tweet.User.avatar,
          repliedCount: tweet.Replies.length,
          likeCount: tweet.Likes.length,
          liked: req.user.LikedTweets ? req.user.LikedTweets.some(l => l.id === like.Tweet.id) : false
        }
      })
      return res.json(result)
    } catch (err) {
      next(err)
    }
  },

  putUser: async (req, res, next) => {
    try {
      if (helpers.getUser(req).id !== Number(req.params.id)) return res.json({ status: 'error', message: "You can't do this!" })
      const user = await User.findByPk(req.params.id)
      if (!user) return res.json({ status: 'error', message: "User didn't exist!" })
      const { name, introduction } = req.body
      if (!name) return res.json({ status: 'error', message: 'Name is required!' })
      if (name.length > 50) return res.json({ status: 'error', message: 'Name must be less than 50 characters!' })
      if (introduction.length > 160) return res.json({ status: 'error', message: 'introduction must be less than 160 characters!' })
      const { files } = req
      if (files) {
        const avatar = files.avatar ? await imgurFileHandler(files.avatar[0]) : null
        const cover = files.cover ? await imgurFileHandler(files.cover[0]) : null
        await user.update({
          name,
          introduction,
          avatar: avatar || user.avatar,
          cover: cover || user.cover
        })
        return res.json({ status: 'success' })
      } else {
        await user.update({
          name,
          introduction,
          avatar: user.avatar,
          cover: user.cover
        })
        return res.json({ status: 'success' })
      }
    } catch (err) {
      next(err)
      return res.json({ status: 'error', message: err.message })
    }
  },

  editAccount: async (req, res, next) => {
    try {
      if (req.user.id !== Number(req.params.id)) return res.json({ status: 'error', message: "You can't do this!" })
      const user = await User.findByPk(req.params.id)
      if (!user) return res.json({ status: 'error', message: "User didn't exist!" })
      const account = req.body.account.trim() || null
      const name = req.body.name.trim() || null
      const email = req.body.email.trim() || null
      const password = req.body.password.trim() || null
      const checkPassword = req.body.checkPassword.trim() || null

      if (!account || !name || !email || !password || !checkPassword) return res.json({ status: 'error', message: 'All fields are required!' })
      if (name.length > 50) return res.json({ status: 'error', message: 'Name must be less than 50 characters!' })
      if (password !== checkPassword) return res.json({ status: 'error', message: 'Passwords do not match!' })

      let sameUser = await User.findOne({ where: { email } })

      if (sameUser) {
        if (sameUser.id !== req.user.id) return res.json({ status: 'error', message: 'Email already existed!' })
      }
      sameUser = await User.findOne({ where: { account } })
      if (sameUser) {
        if (sameUser.id !== req.user.id) return res.json({ status: 'error', message: 'Account already existed!' })
      }
      return bcrypt.hash(req.body.password, 10)
        .then(hash => {
          user.update({
            name: name,
            account: account,
            email: email,
            password: hash
          })
        })

        .then(() => { res.json({ status: 'success' }) })

    } catch (err) {
      next(err)
    }
  },

  addFollow: async (req, res, next) => {
    const followerId = helpers.getUser(req).id
    const followingId = req.body.id
    try {
      const user = await User.findByPk(followingId)
      if (!user) return res.json({ status: 'error', message: "User didn't exist!" })

      const followship = await Followship.findOne({ where: { followerId, followingId } })
      if (followship) return res.json({ status: 'error', message: 'You are already following this user!' })

      if (followerId == followingId) return res.json({ status: 'error', message: "You can't follow yourself!" })

      return Followship.create({ followerId, followingId })
        .then(() => res.json({ status: 'success' }))
    } catch (err) { next(err) }
  },

  removeFollow: async (req, res, next) => {
    const followingId = req.params.followingId
    const followerId = helpers.getUser(req).id
    try {
      const followship = await Followship.findOne({ where: { followerId, followingId } })
      if (!followship) return res.json({ status: 'error', message: "You haven't followed this user!" })

      return followship.destroy()
        .then(() => res.json({ status: 'success' }))
    } catch (err) { next(err) }

  }
}

module.exports = userController

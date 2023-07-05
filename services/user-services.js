const bcrypt = require('bcryptjs')
const { User, Reply, Tweet, Followship, Like } = require('../models')
const jwt = require('jsonwebtoken')
const { imgurFileHandler } = require('../helpers/file-helpers')
const helpers = require('../_helpers')
// sequelize Op 比較功能
const { Op } = require('sequelize')

const userServices = {
  signIn: (req, cb) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      cb(null, {
        status: 'success',
        data: {
          token,
          user: userData,
        }
      })
    } catch (err) {
      cb(err)
    }
  },
  signUp: ({ name, email, password, account }, cb) => {
    return Promise.all([
      User.findOne({ where: { email } }),
      User.findOne({ where: { account } })
    ])
      .then(([user, account]) => {
        if (user) throw new Error('Email already exists!')
        if (account) throw new Error('Account already registered!')
        return bcrypt.hash(password, 10)
      })
      .then(hash => {
        return User.create({
          name,
          email,
          role: 'user',
          account,
          password: hash
        })
      })
      .then((user) => {
        user = user.toJSON()
        delete user.password
        return cb(null, {
          status: 'success',
          user
        })
      })
      .catch(err => cb(err))
  },
  getUser: (req, cb) => {
    return Promise.all([
      User.findByPk(req.params.id, { attributes: { exclude: ['password'] } }),
      Followship.count({ where: { followerId: req.params.id } }),
      Followship.count({ where: { followingId: req.params.id } }),
      Tweet.findAll({ where: { UserId: req.params.id } })
    ])
      .then(([user, follower, following, Tweet]) => {
        if (!user) throw new Error(`User didn't exist`)
        user = user.toJSON()
        user.followerCount = follower // 追蹤數量
        user.followingCount = following // 被追蹤數量
        user.TweetCount = Tweet.length
        const currentUser = helpers.getUser(req)
        user.isFollowing = currentUser.Followings ? currentUser.Followings.some(f => f.id === user.id) : false
        return cb(null, user)
      })
      .catch(err => cb(err))
  },
  getUserTweets: (req, cb) => {
    return Promise.all([
      User.findByPk(req.params.id, {
        include: [
          { model: Tweet, include: [Reply, Like], },
          { model: Like }
        ],
        order: [[Tweet, 'createdAt', 'DESC']],
      }),
      User.findByPk(helpers.getUser(req).id, {
        include: [{ model: Like, attributes: ['TweetId'] }]
      })
    ])
      .then(([user, currentUser]) => {
        if (!user) throw new Error(`User didn't exist`)
        if (!currentUser) throw new Error(`Havn't liked any tweet`)
        const tweetsData = user.Tweets.map(tweet => ({
          id: tweet.id,
          UserId: tweet.UserId,
          description: tweet.description,
          name: user.name,
          account: user.account,
          avatar: user.avatar,
          createdAt: tweet.createdAt,
          replyCount: tweet.Replies.length,
          likeCount: tweet.Likes.length,
          currentUserIsLiked: currentUser.Likes.some(like => like.TweetId === tweet.id)
        }))
        return cb(null, tweetsData)
      })
      .catch(err => cb(err))
  },
  getUserReplies: (req, cb) => {
    User.findByPk(req.params.id, {
      include: [{
        model: Reply, include: { model: Tweet, attributes: ['id'], include: { model: User, attributes: ['account'] } }
      }],
      order: [[Reply, 'createdAt', 'DESC']]
    })
      .then(user => {
        if (!user) throw new Error(`User didn't exist`)
        const repliesData = user.Replies.map(reply => {
          const replyJSON = reply.toJSON()
          return {
            ...replyJSON,
            replyName: user.name,
            replyAccount: user.account,
            replyAvatar: user.avatar,
          }
        })
        return cb(null, repliesData)
      })
      .catch(err => cb(err))
  },
  getUserLikes: (req, cb) => {
    User.findByPk(req.params.id, {
      include: [
        {
          model: Like,
          include: [{ model: Tweet, include: [User, Like, Reply] }]
        }],
      order: [[Like, 'createdAt', 'DESC']]
    })
      .then((user) => {
        if (!user) throw new Error(`User didn't exist`)
        const likesData = user.Likes.map(like => {
          return {
            UserId: like.UserId,
            TweetId: like.TweetId,
            createdAt: like.createdAt,
            description: like.Tweet.description,
            tweetOwnerName: like.Tweet.User.name,
            tweetOwnerAccount: like.Tweet.User.account,
            tweetOwnerAvatar: like.Tweet.User.avatar,
            likeCount: like.Tweet.Likes.length,
            replyCount: like.Tweet.Replies.length,
            currentUserIsLiked: like.Tweet.Likes.some(l => l.UserId === helpers.getUser(req).id)
          }
        })
        return cb(null, likesData)
      })
      .catch(err => cb(err))
  },
  getUserFollowings: (req, cb) => {
    return Promise.all([
      User.findByPk(req.params.id, {
        attributes: ['id', 'name',],
        include: [
          {
            model: User, as: 'Followings',
            attributes: ['id', 'name', 'introduction', 'avatar'],
            through: { attributes: ['createdAt'] },
          },
        ]
      }),
      Tweet.count({ where: { UserId: req.params.id } })
    ])
      .then(([user, tweetCount]) => {
        if (!user) throw new Error(`User didn't exist`)
        let followings = user.Followings.map(following => ({
          followingId: following.id,
          followingName: following.name,
          followingAvatar: following.avatar,
          followingIntroduction: following.introduction,
          followshipCreatedAt: following.Followship.createdAt,
          isFollowing: helpers.getUser(req).Followings.some(f => f.id === following.id)
        }))
        followings = followings.sort((a, b) =>
          new Date(b.followshipCreatedAt) - new Date(a.followshipCreatedAt))
        const result = {
          userId: user.id,
          userName: user.name,
          tweetCount: tweetCount,
          followings: followings
        }
        return cb(null, result)
      })
      .catch(err => cb(err))
  },
  getUserFollowers: (req, cb) => {
    return Promise.all([
      User.findByPk(req.params.id, {
        include: [{ model: User, as: 'Followers', }],
      }),
      Tweet.count({ where: { UserId: req.params.id } })
    ])
      .then(([user, tweetCount]) => {
        if (!user) throw new Error(`User didn't exist`)
        const followers = user.Followers.map(follower => {
          return {
            followerName: follower.name,
            followerAvatar: follower.avatar,
            followerIntroduction: follower.introduction,
            followerId: follower.Followship.followerId,
            createdAt: follower.Followship.createdAt,
            isFollowed: helpers.getUser(req).Followings.some(f => f.id === follower.id)
          }
        })
        followers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        const result = {
          userId: user.id,
          userName: user.name,
          tweetCount: tweetCount,
          followers: followers
        }
        return cb(null, result)
      })
      .catch(err => cb(err))
  },
  editUser: (req, cb) => {
    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error(`User didn't exist`)
        user = user.toJSON()
        delete user.password
        return cb(null, user)
      })
      .catch(err => cb(err))
  },
  putUser: (req, { name, introduction }, cb) => {
    const files = req.files || {}
    return Promise.all([
      User.findByPk(helpers.getUser(req).id),
      files.avatar ? imgurFileHandler(files.avatar[0]) : null,
      files.banner ? imgurFileHandler(files.banner[0]) : null
    ])
      .then(([user, avatarPath, bannerPath]) => {
        if (!user) throw new Error("User didn't exist!")
        if (user.id !== Number(req.params.id)) throw new Error('Edit self profile only!')
        return user.update({
          name,
          introduction,
          avatar: avatarPath || user.avatar,
          banner: bannerPath || user.banner
        })
      })
      .then((updatedUser) => {
        updatedUser = updatedUser.toJSON()
        delete updatedUser.password
        return cb(null, updatedUser)
      })
      .catch(err => cb(err))
  },
  getSetUser: (req, cb) => {
    return User.findByPk(helpers.getUser(req).id, { attributes: ['id', 'name', 'account', 'email'] })
      .then((user) => {
        if (!user) throw new Error("User didn't exist!")
        return cb(null, user)
      })
      .catch(err => cb(err))
  },
  putSetUser: (req, { account, name, email, password }, cb) => {
    return Promise.all([
      User.findByPk(helpers.getUser(req).id, { attributes: ['id', 'name', 'account', 'email'] }),
      User.findOne({
        where: { email, id: { [Op.ne]: helpers.getUser(req).id } }
      }),
      User.findOne({
        where: { account, id: { [Op.ne]: helpers.getUser(req).id } }
      })
    ])
      .then(([user, userEmail, userAccount]) => {
        if (userEmail) throw new Error('Email already exists!')
        if (userAccount) throw new Error('Account already registered!')
        if (!user) throw new Error("User didn't exist!")
        updatedUser = user
        return bcrypt.hash(password, 10)
      })
      .then((hash) => {
        return updatedUser.update({
          name,
          account,
          email,
          password: hash
        })
      })
      .then((updatedUser) => {
        return cb(null, updatedUser)
      })
      .catch(err => cb(err))
  },
  
}

module.exports = userServices
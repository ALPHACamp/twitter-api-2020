const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../models')
const helpers = require('../_helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { User, Followship, Tweet, Reply, Like } = db
const { Op } = require('sequelize')

const userController = {
  register: (req, res, next) => {
    if (req.body.password !== req.body.checkPassword) throw new Error('Passwords do not match!')
    if (req.body.password.length > 8) throw new Error('Passwords should be no more than 8 digit!')
    if (req.body.account.length > 8) throw new Error('Account should be no more than 8 digit!')
    if (!req.body.email.includes('@')) throw new Error('your email address does not have @')
    Promise.all([
      User.findOne({ where: { account: req.body.account } }),
      User.findOne({ where: { email: req.body.email } })
    ])
      .then(([userByAccount, userByEmail]) => {
        if (userByAccount) throw new Error('Account already exists!')
        if (userByEmail) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        account: req.body.account,
        name: req.body.name,
        email: req.body.email,
        password: hash,
        role: 'user',
        avatar: 'https://i.imgur.com/vdw7dQ1.png',
        background: 'https://i.imgur.com/iH11x1t.jpeg'
      }))
      .then(user => {
        const newUser = user.toJSON()
        delete newUser.password
        const data = { user: newUser }
        res.json({ status: 'success', data })
      })
      .catch(err => next(err))
  },
  login: (req, res, next) => {
    try {
      let userData = helpers.getUser(req).toJSON()
      if (userData.role !== 'user') throw new Error('Admin account cannot enter front-end!')
      userData = { id: userData.id }
      // delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  getUser: (req, res, next) => {
    return Promise.all([
      User.findByPk(req.params.id),
      Followship.findOne({
        where: {
          followerId: helpers.getUser(req), // 6 測試用DB裡面的6和下面的4即可得到true
          followingId: req.params.id // 4
        }
      }),
      Followship.findAndCountAll({ where: { followerId: helpers.getUser(req) } }),
      Followship.findAndCountAll({ where: { followingId: helpers.getUser(req) } })
    ])
      .then(([user, followship, followerCount, followingCount]) => {
        if (!user) throw new Error("User didn't exist!")
        user = user.toJSON()
        user.isSelf = Number(req.params.id) === Number(helpers.getUser(req).id)
        user.isfollow = followship !== null
        user.followingAmount = followerCount.count
        user.followerAmount = followingCount.count
        delete user.password
        res.status(200).json(user)
      })
      .catch(err => next(err))
  },
  getUserTweets: (req, res, next) => {
    return Tweet.findAll({
      // raw: true,
      // nest: true,
      where: {
        UserId: req.params.id
      },
      include: [Reply, Like, User],
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        tweets = tweets.map(tweet => {
          return {
            id: tweet.id,
            UserId: tweet.UserId,
            description: tweet.description,
            User: {
              id: tweet.UserId,
              userAccount: tweet.User.account,
              userName: tweet.User.name,
              avatar: tweet.User.avatar
            },
            // userAccount: tweet.User.account,
            // userName: tweet.User.name,
            // avatar: tweet.User.avatar,
            createdAt: tweet.createdAt,
            updatedAt: tweet.updatedAt,
            likedAmount: tweet.Likes.length,
            repliedAmount: tweet.Replies.length,
            isLike: tweet.Likes.map(t => t.id).includes(helpers.getUser(req).id)
          }
        })
        res.status(200).json(tweets)
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => { // 這個還沒檢查格式
    if (Number(req.params.id) !== helpers.getUser(req).id) throw new Error('permission denied.')
    const { name, introduction } = req.body
    const { files } = req
    const nameMax = 50
    const introMax = 160
    const avatar = files?.avatar ? files.avatar[0] : null
    const background = files?.background ? files.background[0] : null
    return Promise.all([
      User.findByPk(req.params.id),
      imgurFileHandler(avatar),
      imgurFileHandler(background)
    ])
      .then(([user, avatar, background]) => {
        if (!user) throw new Error("User didn't exist!")
        if (name.length > nameMax) throw new Error('the length of name should be under 50.')
        if (introduction.length > introMax) throw new Error('the length of introduction should be under 160.')
        return user.update({
          name,
          introduction,
          avatar: avatar || user.avatar,
          background: background || user.background
        })
      })
      .then(user => {
        // const user = updatedUser.toJSON()
        res.status(200).json(user)
      })
      .catch(err => next(err))
  },
  getRepliedTweets: (req, res, next) => {
    Reply.findAll({
      where: { UserId: req.params.id },
      include: [User, { model: Tweet, include: User }],
      order: [['createdAt', 'DESC']],
      nest: true,
      raw: true
    })
      .then(replies => {
        replies = replies.map(reply => {
          reply = {
            ...reply,
            repliedAccount: reply.Tweet.User.account,
            User: {
              id: reply.User.id,
              account: reply.User.account,
              name: reply.User.name,
              avatar: reply.User.avatar
            }
          }
          delete reply.Tweet
          return reply
        })
        res.json(replies.sort((a, b) => b.createdAt - a.createdAt))
      })
      .catch(err => next(err))
  },
  putUserSetting: (req, res, next) => {
    if (helpers.getUser(req).id !== Number(req.params.id)) throw new Error('You have no permission!')
    const { account, name, email, password, checkPassword } = req.body
    if (password !== checkPassword) throw new Error('Passwords do not match!')
    if (password.length > 8) throw new Error('Passwords should be no more than 8 digit!')
    if (account.length > 8) throw new Error('Account should be no more than 8 digit!')
    if (!email.includes('@')) throw new Error('your email address does not have @')
    return Promise.all([
      User.findByPk(req.params.id),
      bcrypt.hash(password, 10),
      User.findOne({ where: { account } }),
      User.findOne({ where: { email } })
    ])
      .then(([user, hash, checkAccount, checkEmail]) => {
        if (!user) throw new Error("User didn't exist!")
        if (checkAccount && checkAccount?.toJSON().account !== user.account) throw new Error('The account is used!')
        if (checkEmail && checkEmail?.toJSON().email !== user.email) throw new Error('The email is used!')
        return user.update({
          name,
          account,
          email,
          password: hash
        })
      })
      .then(user => {
        res.status(200).json(user)
      })
      .catch(err => next(err))
  },
  getUserLikes: (req, res, next) => {
    return Like.findAll({
      where: {
        UserId: req.params.id
      },
      include: [
        { model: Tweet, include: [Reply, Like] },
        User
      ]
    })
      .then(likes => {
        const tweets = likes.map(like => {
          const TweetId = like.Tweet.id
          const { id, name, account, avatar } = like.User
          const tweet = {
            TweetId,
            ...like.Tweet.toJSON(),
            User: {
              id,
              account,
              name,
              avatar
            },
            likedAmount: like.Tweet.Likes.length,
            repliedAmount: like.Tweet.Replies.length,
            isLike: true
          }
          delete tweet.Replies
          delete tweet.Likes
          return tweet
        })
        tweets.sort((a, b) => b.createdAt - a.createdAt)
        res.json(tweets)
      })
      .catch(err => next(err))
  },
  getUserFollowings: (req, res, next) => {
    return User.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'Followings',
        attributes: ['id', 'name', 'avatar', 'introduction'],
        include: [{
          model: User,
          as: 'Followers'
        }]
      }],
      order: [[{ model: User, as: 'Followings' }, Followship, 'createdAt', 'DESC']]
    })
      .then(followings => {
        if (!followings) throw new Error("User didn't exist")
        const result = followings.Followings
          .map(following => {
            const { Followers, Followship, ...data } = following.toJSON()
            data.followingId = following.id
            data.isFollow = following.Followers.some(follower => follower.id === helpers.getUser(req).id)
            return data
          })
        res.status(200).json(result)
      })
      .catch(err => next(err))
  },
  getUserFollowers: (req, res, next) => {
    return User.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'Followers',
        attributes: ['id', 'name', 'avatar', 'introduction'],
        include: [{
          model: User,
          as: 'Followers'
        }]
      }],
      order: [[{ model: User, as: 'Followers' }, Followship, 'createdAt', 'DESC']]
    })
      .then(followers => {
        if (!followers) throw new Error("User didn't exist")
        const result = followers.Followers
          .map(follower => {
            const { Followers, Followship, ...data } = follower.toJSON()
            data.followerId = follower.id
            data.isFollow = follower.Followers.some(follower => follower.id === helpers.getUser(req).id)
            return data
          })
        res.status(200).json(result)
      })
  },
  getRecommendUsers: (req, res, next) => {
    return User.findAll({
      where: {
        id: {
          [Op.ne]: helpers.getUser(req).id
        }
      },
      include: { model: User, as: 'Followers' },
      attributes: ['id', 'name', 'account', 'avatar'],
      limit: 10
    })
      .then(users => {
        const result = users.map(user => ({
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          account: user.account,
          followerCount: user.Followers.length,
          isFollow: user.Followers.some(f => f.id === user.id),
          isSelf: Number(user.id) === Number(helpers.getUser(req).id)
        }))
          .sort((a, b) => b.followerCount - a.followerCount)
        res.status(200).json(result)
      })
      .catch(err => next(err))
  }
}
module.exports = userController

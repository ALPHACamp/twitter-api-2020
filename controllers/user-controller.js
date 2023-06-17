const { use } = require('chai')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Sequelize = require('sequelize')
const { User, Tweet, Reply, Followship, Like } = require('../models')
const { imgurFileHandler } = require('../_helpers')

const userController = {
  signUp: (req, res, next) => {
    Promise.all([
      User.findOne({ where: { email: req.body.email } }),
      User.findOne({ where: { account: req.body.account } })
    ])
      .then(([userByEmail, userByAccount]) => {
        if (req.body.password !== req.body.checkPassword) throw new Error('Passwords do not match!')
        if (userByEmail || userByAccount) throw new Error('Email or Account already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        account: req.body.account,
        password: hash,
        role: req.body.role
      }))
      .then(user => {
        return res.json({ user })
      })
      .catch(err => next(err))
  },
  signIn: (req, res, next) => {
    const { account, password } = req.body
    return User.findOne({
      where: { account }
    })
      .then(user => {
        if (!user) throw new Error('帳號或密碼輸入錯誤！')
        if (!bcrypt.compareSync(password, user.password)) throw new Error('帳號或密碼輸入錯誤！')
        const userData = user.toJSON()
        delete userData.password
        const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
        return res.json({ token, user: userData })
      })
      .catch(err => next(err))
  },
  getUser: (req, res, next) => {
    const userId = Number(req.params.user_id) || ''
    return User.findByPk(userId, {
      raw: true,
      nest: true,
      attributes: {
        include: [
          [
            Sequelize.literal('(SELECT COUNT(DISTINCT id) FROM Followships WHERE Followships.following_id = User.id)'),
            'followersCount',
          ],
          [
            Sequelize.literal('(SELECT COUNT(DISTINCT id) FROM Followships WHERE Followships.follower_id = User.id)'),
            'followingsCount',
          ]
        ]
      },
    })
      .then((user) => {
        if (!user) throw new Error("User didn't exist!")
        res.json(user)
      })
      .catch(err => next(err))
  },
  getUserTweets: (req, res, next) => {
    const userId = Number(req.params.user_id) || ''
    Tweet.findAll({
      include: [
        {
          model: User,
          attributes: { exclude: ['password'] },
        }
      ],
      where: {
        ...userId ? { userId } : {}
      },
      nest: true,
      raw: true
    })
      .then(tweets => {
        if (!tweets.length) throw new Error("User's tweets didn't exist!")
        res.json(tweets)
      })
      .catch(err => next(err))
  },
  getUserRepliedTweets: (req, res, next) => {
    const userId = Number(req.params.user_id) || ''
    Reply.findAll({
      include: [
        {
          model: User,
          attributes: { exclude: ['password'] },
        },
        Tweet
      ],
      where: {
        ...userId ? { userId } : {}
      },
      nest: true,
      raw: true
    })
      .then(replies => {
        if (!replies.length) throw new Error("User's replies didn't exist!")
        res.json(replies)
      })
      .catch(err => next(err))
  },
  getUserLikes: (req, res, next) => {
    const userId = Number(req.params.user_id) || ''
    Like.findAll({
      include: [
        { model: User },
        { model: Tweet }
      ],
      where: {
        ...userId ? { userId } : {}
      },
      attributes: { exclude: ['password'] },
      nest: true,
      raw: true
    })
      .then(likedtweets => {
        if (!likedtweets.length) throw new Error("User's likedtweets didn't exist!")
        res.json(likedtweets)
      })
      .catch(err => next(err))
  },
  getUserFollowings: (req, res, next) => {
    const userId = Number(req.params.user_id) || ''
    User.findAll({
      include: {
        model: User, as: 'Followings',
        attributes: { exclude: ['password'] }
      },
      attributes: { exclude: ['password'] },
      where: { id: userId },
      nest: true,
      raw: true
    })
      .then(data => {
        if (!data.length) throw new Error("User's following didn't exist!")
        const followings = data.map(user => user.Followings)
        followings.map(following => {
          following.followingId = following.id
          delete following.id

        })
        res.json(followings)
      })
      .catch(err => next(err))
  },
  getUserFollowers: (req, res, next) => {
    const userId = Number(req.params.user_id) || ''
    User.findAll({
      include: {
        model: User, as: 'Followers',
        attributes: { exclude: ['password'] }
      },
      attributes: { exclude: ['password'] },
      where: { id: userId },
      nest: true,
      raw: true
    })
      .then(data => {
        if (!data.length) throw new Error("User's followers didn't exist!")
        const followers = data.map(user => user.Followers)
        followers.map(follower => {
          follower.followerId = follower.id
          delete follower.id
        })
        res.json(followers)
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    return User.findByPk((req.params.user_id), {
      nest: true,
      raw: true
    })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        delete user.password
        return res.json(user)
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { file } = req
    return Promise.all([
      User.findByPk(req.params.user_id),
      imgurFileHandler(file)])
      .then(([user, filePath]) => {
        if (!req.body.name) throw new Error('User name is required!')
        if (!user) throw new Error("User didn't exist!")
        return user.update({
          account: req.body.account || user.account,
          name: req.body.name || user.name,
          email: req.body.email || user.email,
          introduction: req.body.introduction || user.introduction,
          avatar: filePath || user.avatar
        })
      })
      .then(user => {
        const putData = user.dataValues
        delete putData.password
        return res.json(putData)
      })
      .catch(err => next(err))
  },
  getTopUsers: (req, res, next) => {
    const rank = req.query.rank
    return User.findAll({
      include: [
        {
          model: User, as: 'Followers',
          attributes: { exclude: ['password'] }
        }
      ],
      attributes: { exclude: ['password'] }
    })
      .then(users => {
        const result = users.map(user => ({
          ...user.toJSON(),
          followerCount: user.Followers.length,
          isFollowed: req.user.Followings.some(f => f.id === user.id)
        }))
          .sort((a, b) => b.followerCount - a.followerCount)
          .slice(0, rank)
        if (!result.length) throw new Error("Top users not exist!")
        return res.json({ users: result })
      })
      .catch(err => next(err))
  },
  addFollowing: (req, res, next) => {
    const userId = req.params.user_id
    Promise.all([
      User.findByPk(userId),
      Followship.findOne({
        where: {
          followerId: req.user.id,
          followingId: userId
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error("User didn't exist!")
        if (followship) throw new Error('You are already following this user!')
        return Followship.create({
          followerId: req.user.id,
          followingId: userId
        })
      })
      .then(followship => res.json(followship))
      .catch(err => next(err))
  },
  removeFollowing: (req, res, next) => {
    Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.user_id
      }
    })
      .then(followship => {
        if (!followship) throw new Error("You haven't followed this user!")
        return followship.destroy()
      })
      .then(deletedFollowship => res.json(deletedFollowship))
      .catch(err => next(err))
  }
}
module.exports = userController

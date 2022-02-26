const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User, Tweet, Reply, Like } = require('../models')
const helpers = require('../_helpers')
const sequelize = require('sequelize')

const userController = {
  signIn: (req, res, next) => {
    const { account, password } = req.body
    if (!account || !password) throw new Error('account and password are required!')

    return User.findOne({
      where: { account }
    })
      .then(user => {
        if (!user) throw new Error('User not exist!')
        if (user.role === 'admin') throw new Error('User not exist!')
        if (!bcrypt.compareSync(password, user.password)) throw new Error('password incorrect!')
        const userData = user.toJSON()
        delete userData.password
        const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
        return res.status(200).json({
          token,
          user: userData
        })
      })
      .catch(err => next(err))
  },
  signUp: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    if (password !== checkPassword) throw new Error('Passwords do not match!')

    return User.findAll({
      $or: [
        { where: { account } },
        { where: { email } },
        { where: { name } }
      ]
    })
      .then(users => {
        if (users.some(u => u.email === email)) throw new Error('Email already exists!')
        if (users.some(u => u.account === account)) throw new Error('Account already exists!')
        if (users.some(u => u.name === name)) throw new Error('Name already exists!')

        return bcrypt.hash(password, 10)
      })
      .then(hash => {
        return User.create({
          account,
          password: hash,
          name,
          email,
          role: ''
        })
      })
      .then(newUser => {
        const user = newUser.toJSON()
        delete user.password
        return res.status(200).json(user)
      })
      .catch(err => next(err))
  },
  getUser: (req, res, next) => {
    const userId = Number(req.params.id)
    User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [
        { model: User, as: 'Followers', attributes: { exclude: ['password'] } },
        { model: User, as: 'Followings', attributes: { exclude: ['password'] } }
      ]
    })
      .then(user => {
        if (!user) throw new Error('User not exits!')
        if (user.role === 'admin') throw new Error('User not exits!')
        return res.status(200).json(user)
      })
      .catch(err => next(err))
  },
  putUserSetting: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    if (password !== checkPassword) throw new Error('Passwords do not match!')
    if (!account || !name || !email) throw new Error('Account, name and email are required!')
    if (helpers.getUser(req).id !== Number(req.params.id)) throw new Error('permission denied')
    return Promise.all([
      User.findAll({
        where: {
          $or: [
            { account },
            { email }
          ]
        },
        raw: true,
        nest: true
      }),
      User.findByPk(Number(req.params.id)),
      bcrypt.hash(password, 10)
    ])
      .then(([checkUsers, user, hash]) => {
        if (checkUsers.some(u => u.email === email)) throw new Error('email is registered')
        if (checkUsers.some(u => u.account === account)) throw new Error('account is registered')
        return user.update({
          account,
          name,
          email,
          password: hash
        })
      })
      .then(updatedUser => res.status(200).json({ user: updatedUser }))
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const getUserId = Number(req.params.id)
    const { name, introduction } = req.body
    if (!name) throw new Error('name is required!')
    if (helpers.getUser(req).id !== getUserId) throw new Error('permission denied')
    return User.findByPk(getUserId)
      .then(user => {
        if (!user) throw new Error('user not exist!')
        return user.update({
          name,
          introduction
        })
      })
      .then(updatedUser => res.status(200).json({ user: updatedUser }))
      .catch(err => next(err))
  },
  getUserTweets: (req, res, next) => {
    const getUserId = Number(req.params.id)
    return Tweet.findAll({
      where: { UserId: getUserId },
      attributes: [
        ['id', 'tweetId'],
        'createdAt',
        'description',
        'image',
        [
          sequelize.literal(
            '(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'
          ),
          'LikesCount'
        ],
        [
          sequelize.literal(
            '(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'
          ),
          'RepliesCount'
        ]
      ],
      include: [
        { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
      ],
      order: [['createdAt', 'DESC']],
      group: 'tweetId',
      nest: true,
      raw: true
    })
      .then(tweets => {
        if (!tweets) throw new Error('User not exits!')
        return res.status(200).json(tweets)
      })
      .catch(err => next(err))
  },
  getReplies: (req, res, next) => {
    const getUserId = Number(req.params.id)
    return Reply.findAll({
      where: { UserId: getUserId },
      attributes: [
        ['id', 'replyId'],
        'comment',
        'createdAt'
      ],
      include: [
        { model: Tweet, attributes: [['id', 'tweetId'], 'description', 'image'] },
        { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
      ],
      order: [['createdAt', 'DESC']]
    })
      .then(replies => {
        if (!replies) throw new Error('No replies')
        return res.status(200).json(replies)
      })
      .catch(err => next(err))
  },
  getFollowings: (req, res, next) => {
    const getUserId = Number(req.params.id)
    return User.findByPk(getUserId, {
      include: [{
        model: User, as: 'Followings',
        attributes: [
          ['id', 'followingId'],
          'name',
          'account',
          'avatar',
          'cover',
          'introduction'
        ]
      }]
    })
      .then(followings => {
        const result = followings.Followings
          .map(following => ({
            ...following.toJSON(),
          }))
        return res.json(result)
      })
      .catch(err => next(err))
  },
  getFollowers: (req, res, next) => {
    const getUserId = Number(req.params.id)
    return User.findByPk(getUserId, {
      include: [{
        model: User, as: 'Followers',
        attributes: [
          ['id', 'followerId'],
          'name',
          'account',
          'avatar',
          'cover',
          'introduction'
        ]
      }]
    })
      .then(followers => {
        const result = followers.Followers
          .map(followers => ({
            ...followers.toJSON(),
          }))
        return res.json(result)
      })
      .catch(err => next(err))
  },
  getLikes: (req, res, next) => {
    // 我們還需要 user name、user account、這個tweet的留言數 以及 這個tweet的按讚數
    const getUserId = Number(req.params.id)
    return Like.findAll({
      where: {
        UserId: getUserId
      },
      include: {
        model: Tweet,
        include: [
          { model: User, attributes: ['id', 'name', 'account'] },
          { model: Like },
          { model: Reply }
        ]
      }
    },
    )
      .then(likes => {
        const likesArray = likes
          .map(like => ({
            ...like.toJSON()
          }))

        likesArray
          .forEach(like => {
            like.Tweet.Likes = like.Tweet.Likes.length
            like.Tweet.Replies = like.Tweet.Replies.length
          })

        return res.json(likesArray)
      })
      .catch(err => next(err))
  },
  topFollowed: (req, res, next) => {
    const userId = helpers.getUser(req).id

    return Promise.all([
      User.findByPk(userId, {
        include: { model: User, as: 'Followings' },
      }),
      User.findAll({
        include: { model: User, as: 'Followers' },
        attributes: ['id', 'name', 'account', 'createdAt']
      })
    ])
      .then(([user, users]) => {
        const reqUser = user.toJSON()
        const reqUserFollowing = reqUser.Followings

        const result = users
          .map(u => ({
            ...u.toJSON(),
            followedCount: u.Followers.length,
            isFollowing: reqUserFollowing.some(f => f.id === u.id)
          }))
          .sort((a, b) => b.followedCount - a.followedCount || b.createdAt - a.createdAt)
          .slice(0, 10)

        result.forEach(r => {
          delete r.Followers
        })

        res.status(200).json(result)
      })
      .catch(err => next(err))
  }
}

module.exports = userController
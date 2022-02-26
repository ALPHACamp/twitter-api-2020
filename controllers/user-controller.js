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
        if (!user) throw new Error('帳號不存在！')
        if (user.role === 'admin') throw new Error('帳號不存在！')
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
        { where: { email } }
      ]
    })
      .then(users => {
        if (users.some(u => u.email === email)) throw new Error('email 已重複註冊！')
        if (users.some(u => u.account === account)) throw new Error('account 已重複註冊！')
        if (name.length > 50) throw new Error('字數超出上限！')

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
        if (!user) throw new Error('帳號不存在！')
        if (user.role === 'admin') throw new Error('帳號不存在！')
        return res.status(200).json(user)
      })
      .catch(err => next(err))
  },
  putUserSetting: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    if (password !== checkPassword) throw new Error('Passwords do not match!')
    if (name.length > 50) throw new Error('字數超出上限！')
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
        if (checkUsers.some(u => u.email === email)) throw new Error('email 已重複註冊！')
        if (checkUsers.some(u => u.account === account)) throw new Error('account 已重複註冊！')
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
    if (name.length > 50) throw new Error('字數超出上限！')
    if (introduction.length > 160) throw new Error('字數超出上限！')
    if (helpers.getUser(req).id !== getUserId) throw new Error('permission denied')
    return User.findByPk(getUserId)
      .then(user => {
        if (!user) throw new Error('帳號不存在！')
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
    const reqUserId = helpers.getUser(req).id
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
        { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
        { model: Like, attributes: ['userId'] }
      ],
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        if (!tweets) throw new Error('User not exits!')

        const result = tweets
          .map(t => ({
            ...t.toJSON()
          }))

        result.forEach(tweet => {
          tweet.isLiked = tweet.Likes.some(l => l.userId === reqUserId)
          delete tweet.Likes
        })
        return res.status(200).json(result)
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
        { model: Tweet, attributes: [['id', 'tweetId'], 'description', 'image'], include: { model: User, attributes: ['id', 'name', 'account'] } },
        { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
      ],
      order: [['createdAt', 'DESC']]
    })
      .then(replies => {
        if (!replies) throw new Error('No replies')

        const result = replies
          .map(r => ({
            ...r.toJSON()
          }))

        result.forEach(r => {
          r.Tweet.TweetUserId = r.Tweet.User.id
          r.Tweet.TweetUserName = r.Tweet.User.name
          r.Tweet.TweetUserAccount = r.Tweet.User.account
          delete r.Tweet.User
        })

        return res.status(200).json(result)
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
            like.Tweet.likesCount = like.Tweet.Likes.length
            like.Tweet.repliesCount = like.Tweet.Replies.length
            delete like.Tweet.Likes
            delete like.Tweet.Replies
          })

        return res.json(likesArray)
      })
      .catch(err => next(err))
  },
  topFollowed: (req, res, next) => {
    const reqUser = helpers.getUser(req)

    return User.findAll({
      include: { model: User, as: 'Followers' },
      attributes: ['id', 'name', 'account', 'avatar', 'createdAt'],
      where: { role: { $not: 'admin' } }
    })
      .then(users => {
        const reqUserFollowing = reqUser.Followings.length > 1 ? reqUser.Followings : [reqUser.Followings]

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
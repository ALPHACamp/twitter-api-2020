const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt-nodejs')
const { User, Tweet, Reply, Like, Followship } = require('../models')
const sequelize = require('sequelize')
const helpers = require('../_helpers')

const userController = {
  signIn: (req, res, next) => {
    const { account, password } = req.body
    if (!account || !password) throw new Error('account and password are required!')

    return User.findOne({ where: { account } })
      .then(user => {
        if (!user) throw new Error('帳號不存在！')
        if (user.role === 'admin') throw new Error('帳號不存在！')
        if (!bcrypt.compareSync(password, user.password)) throw new Error('incorrect account or password!')
        const userData = user.toJSON()
        delete userData.password
        const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
        res.status(200).json({
          status: 'success',
          data: {
            token,
            user: userData
          }
        })
      })
      .catch(err => next(err))
  },
  postUser: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    if (!account || !name || !email || !password || !checkPassword) throw new Error('all fields are required')

    if (password !== checkPassword) throw new Error('Two password need to be same.')

    return Promise.all([User.findOne({ where: { account } }), User.findOne({ where: { email } })])
      .then(([accountUsed, emailUsed]) => {
        if (accountUsed) throw new Error('account 已重複註冊！')
        if (emailUsed) throw new Error('email 已重複註冊！')

        return User.create({
          account,
          name,
          email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
        })
      })
      .then(user => res.status(200).json({
        status: 'success',
        data: {
          user: user.toJSON()
        }
      })).catch(err => next(err))
  },
  getUser: (req, res, next) => {
    const currentUser = helpers.getUser(req).dataValues
    console.log(currentUser)
    const { id } = req.params
    return User.findByPk(id, {
      include:
        [{
          model: User,
          as: 'Followings',
          attributes: ['id']
        },
        {
          model: User,
          as: 'Followers',
          attributes: ['id']
        },
        {
          model: Tweet,
          attributes: ['id']
        }
        ]
    })
      .then(user => {
        if (!user) throw new Error('帳號不存在！')
        user = {
          ...user.toJSON(),
          tweetCount: user.Tweets.length,
          followerCount: user.Followers.length,
          followingCount: user.Followings.length,
          isFollowed: user.Followers.some(u => u.id === currentUser.id)
        }

        delete user.password
        delete user.Tweets
        delete user.Followers
        res.status(200).json(user)
      })
      .catch(err => next(err))
  },
  getUserTweets: (req, res, next) => {
    const UserId = req.params.id
    return Tweet.findAll({
      where: { UserId },
      attributes: ['id','description', 'createdAt'],
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['id', 'account', 'name', 'avatar'], as: 'tweetAuthor' }, { model: Reply, attributes: ['id'] }, { model: Like, attributes: ['UserId'] }]
    })
      .then(tweets => {
        const currentUser = helpers.getUser(req)
        tweets.forEach(tweet => {
          tweet = tweet.dataValues
          tweet.replyCounts = tweet.Replies.length,
          tweet.likeCounts = tweet.Likes.length,
          tweet.isLiked = tweet.Likes.some(l => l.UserId === currentUser.id)  
          delete tweet.Replies
          delete tweet.Likes
        })
        res.status(200).json(tweets)
      }).catch(err => next(err))
  },
  getUserReplies: (req, res, next) => {
    const UserId = req.params.id
    return Reply.findAll({
      where: { UserId },
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['id', 'account', 'name', 'avatar'], foreignKey: 'UserId', as: 'replyUser' },
      { model: Tweet, attributes: ['id', 'description'], include: [{ model: User, attributes: ['id', 'account'], as: 'tweetAuthor' }] }]
    })
      .then(replies => {
        replies.forEach(reply => {
          reply = reply.dataValues
          reply.tweetAuthorAccount = reply.Tweet.tweetAuthor.account
          delete reply.Tweet.dataValues.tweetAuthor
        })
        res.status(200).json(replies)
      }).catch(err => next(err))
  },
  getUserLikes: (req, res, next) => {
    const UserId = req.params.id
    return Like.findAll({
      where: { UserId },
      order: [['createdAt', 'DESC']],
      attributes: ['TweetId'],
      include: [{
        model: Tweet,
        attributes:
          ['id', 'description', 'createdAt'],
        include: [{
          model: User,
          attributes:
            ['id', 'account', 'name',
              'avatar'], as: 'tweetAuthor'
        }, { model: Reply }, { model: Like }]
      }]
    })
      .then(likes => {
        const currentUser = helpers.getUser(req)
        likes = likes.map(like => ({
          ...like.toJSON(),
        }))
        likes.forEach(like => {
          like.replyCounts = like.Tweet.Replies.length,
            like.likeCounts = like.Tweet.Likes.length,
            like.isLiked = like.Tweet.Likes.map(u => u.UserId).includes(currentUser.id)
          delete like.Tweet.Replies
          delete like.Tweet.Likes
        })
        return res.status(200).json(likes)
      })
      .catch(err => next(err))
  },

  getUserFollowers: (req, res, next) => {
    const UserId = req.params.id
    return User.findByPk(UserId, {
      attributes: ['id',
        'name',
        'account',
        'avatar',
        'introduction'],
      include:
        [{
          model: User,
          as: 'Followers',
          attributes: ['id',
            'name',
            'account',
            'avatar',
            'introduction']
        }],
      order:
        [[sequelize.col('Followers.created_at', 'DESC')]]
    })
      .then(user => {
        const userFollowings = helpers.getUser(req).Followings.map(user => user.id)
        const followers = user.toJSON().Followers

        followers.forEach(data => {
          data.followerId = data.Followship.followerId
          data.isFollowed = userFollowings.some(id => id === data.id)
          delete data.Followship
        })
        res.status(200).json(followers)
      }).catch(err => next(err))
  },
  getUserFollowings: (req, res, next) => {
    const UserId = req.params.id
    return User.findByPk(UserId, {
      attributes: ['id',
        'name',
        'account',
        'avatar',
        'introduction'],
      include:
        [{
          model: User,
          as: 'Followings',
          attributes: ['id',
            'name',
            'account',
            'avatar',
            'introduction']
        }],
      order:
        [[sequelize.col('Followings.created_at', 'DESC')]]
    })
      .then(user => {
        const userFollowings = helpers.getUser(req).Followings.map(user => user.id)

        const followings = user.toJSON().Followings

        followings.forEach(data => {
          data.followingId = data.Followship.followingId
          data.isFollowed = userFollowings.some(id => id === data.id)
          delete data.Followship
        })
        res.status(200).json(followings)
      }).catch(err => next(err))
  },
  getPopularUsers: (req, res, next) => {
    const currentUser = helpers.getUser(req).id
    return User.findAll({
      include: {
        model: User, as: 'Followers', attributes: ['id']
      },
      attributes: ['id',
        'name',
        'avatar',
        'account'],
      where: { role: 'user' }

    })
      .then(users => {
        users.forEach(user => {
          user = user.dataValues
          user.followerCounts = user.Followers.length
          user.isFollowed = user.Followers.some(u => u.id === currentUser)
          delete user.Followers
        })
        users.sort((a, b) => b.followerCounts - a.followedCount).slice(0, 10)

        res.status(200).json(users)
      }).catch(err => next(err))
  }

}





module.exports = userController

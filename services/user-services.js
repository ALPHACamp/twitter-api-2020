const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')
const sequelize = require('sequelize')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { User, Tweet, Reply, Like, Followship } = require('../models')
const helpers = require('../_helpers.js')
const jwt = require('jsonwebtoken')
const userServices = {
  signUp: (req, cb) => {
    const { name, account, email, password, checkPassword } = req.body
    // check if password equals checkPassword
    if (password !== checkPassword) throw new Error('第二次輸入密碼有誤')
    Promise.all([
      User.findOne({ where: { account } }),
      User.findOne({ where: { email } })
    ])
      .then(([user1, user2]) => {
        if (user1) {
          throw new Error('account 已重複註冊！')
        }
        if (user2) {
          throw new Error('email 已重複註冊！')
        }
        return bcrypt.hash(password, 10)
      })
      .then(hash => {
        return User.create({
          name,
          account,
          email,
          password: hash,
          avatar: 'https://imgur.com/5OL5wJt.png',
          coverPhoto: 'https://imgur.com/hJ4J9gn.png',
          role: 'user'
        })
      })
      .then(() => {
        return cb(null, '註冊成功')
      })
      .catch(err => cb(err))
  },
  signIn: (req, cb) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      // sign JWT with 30 days validation
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      const data = {
        token,
        role: userData.role
      }
      cb(null, data)
    } catch (err) {
      cb(err)
    }
  },
  getUser: (req, cb) => {
    return User.findByPk(req.params.id, {
      include: [
        { model: User, as: 'Followers' }
      ],
      attributes: ['id', 'name', 'account', 'email', 'avatar', 'coverPhoto', 'introduction',
        [sequelize.literal('(SELECT COUNT (*) FROM Followships WHERE Followships.following_id = User.id )'), 'followerCount'],
        [sequelize.literal('(SELECT COUNT (*) FROM Followships WHERE Followships.follower_id = User.id )'), 'followingCount']
      ],
      nest: true
    })
      .then(user => {
        if (!user) throw new Error('使用者不存在')
        const data = {
          ...user.toJSON(),
          isFollowed: user.Followers.some(f => f.id === req.user.id)
        }
        delete data.Followers
        return cb(null, data)
      })
      .catch(err => cb(err))
  },
  getUserTweets: (req, cb) => {
    return Tweet.findAll({
      where: { UserId: req.params.id },
      order: [['createdAt', 'DESC']],
      include: [Like,
        { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
      ],
      attributes: {
        include: [
          [sequelize.literal('(SELECT COUNT (*) FROM Replies WHERE Replies.tweet_id = Tweet.id )'), 'replyCount'],
          [sequelize.literal('(SELECT COUNT (*) FROM Likes WHERE Likes.tweet_id = Tweet.id )'), 'likeCount']
        ]
      }
    })
      .then(tweets => {
        tweets = tweets.map(tweet => {
          tweet = {
            ...tweet.toJSON(),
            isLiked: tweet.Likes.map(like => like.UserId).includes(helpers.getUser(req).id)
          }
          delete tweet.Likes
          return tweet
        })
        return cb(null, tweets)
      })
      .catch(err => cb(err))
  },
  getUserRepliedTweets: (req, cb) => {
    return Reply.findAll({
      where: { UserId: req.params.id },
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] },
      { model: Tweet, include: [{ model: User, attributes: ['id', 'name', 'account'] }] }
      ]
    })
      .then(replies => {
        replies = replies.map(reply => {
          reply = {
            ...reply.toJSON()
          }
          return reply
        })
        return cb(null, replies)
      })
      .catch(err => cb(err))
  },
  getUserLikesTweets: (req, cb) => {
    return Like.findAll({
      where: { UserId: req.params.id },
      include: [User,
        {
          model: Tweet,
          include: [
            { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
          ],
          attributes: {
            include: [
              [sequelize.literal('(SELECT COUNT (*) FROM Replies WHERE Replies.tweet_id = Tweet.id )'), 'replyCount'],
              [sequelize.literal('(SELECT COUNT (*) FROM Likes WHERE Likes.tweet_id = Tweet.id )'), 'likeCount']
            ]
          }
        }
      ],
      order: [['createdAt', 'DESC']],
      nest: true
    })
      .then(likes => {
        const tweets = likes.map(l => {
          l = {
            TweetId: l.TweetId,
            createdAt: l.createdAt,
            Tweet: l.Tweet.toJSON(),
            isLiked: true
          }
          return l
        })
        return cb(null, tweets)
      })
      .catch(err => cb(err))
  },
  putUser: (req, cb) => {
    try {
      const { name, introduction } = req.body
      const { files } = req
      if (introduction.length > 160) throw new Error('自我介紹字數超出上限160字！')
      if (name.length > 50) throw new Error('暱稱字數超出上限50字！')
      return User.findByPk(req.params.id)
        .then(user => {
          if (JSON.stringify(files) !== '{}' && files !== undefined) {
            return Promise.all([
              imgurFileHandler(files.coverPhoto),
              imgurFileHandler(files.avatar)
            ])
              .then(([coverFilePath, avatarFilePath]) => {
                return user.update({
                  name,
                  avatar: avatarFilePath || user.avatar,
                  coverPhoto: coverFilePath || user.coverPhoto,
                  introduction
                })
              })
          } else {
            return user.update({
              name,
              introduction
            })
          }
        })
        .then(updatedUser => {
          cb(null, {
            avatar: updatedUser.avatar,
            coverPhoto: updatedUser.coverPhoto,
            name: updatedUser.name,
            introduction: updatedUser.introduction
          })
        })
    } catch (err) {
      cb(err)
    }
  },
  putAccount: (req, cb) => {
    const { name, account, email, password, checkPassword } = req.body
    if (password !== checkPassword) throw new Error('第二次輸入密碼有誤')
    if (name.length > 50) throw new Error('暱稱字數超出上限50字！')
    return User.findAll({
      where: {
        [Op.or]: [
          { email },
          { account }
        ]
      },
      attributes: ['account', 'email', 'id'],
      raw: true,
      nest: true
    })
      .then(user => {
        // check if email or account already used by user other than login user
        if (user.some(u => u.email === email && u.id !== helpers.getUser(req).id)) throw new Error('信箱已被註冊')
        if (user.some(u => u.account === account && u.id !== helpers.getUser(req).id)) throw new Error('帳號已被註冊')
        return User.findByPk(req.params.id)
      })
      .then(user => {
        return user.update({
          name,
          account,
          email,
          password: password ? bcrypt.hashSync(password, 10) : user.password
        })
      })
      .then(() => {
        cb(null, '操作成功')
      })
      .catch(err => cb(err))
  },
  getFollowers: (req, cb) => {
    return Promise.all([
      User.findByPk(req.params.id, {
        include: [{
          model: User,
          as: 'Followers',
          attributes: ['id', 'name', 'avatar', 'introduction', 'account']
        }],
        order: [['createdAt', 'DESC']]
      }),
      Followship.findAll({
        where: { followerId: helpers.getUser(req).id },
        raw: true
      })
    ])
      .then(([user, followings]) => {
        if (!user.Followers.length) return cb(null, [])
        const currentFollowings = followings.map(f => f.followingId)
        const followers = user.Followers.map(f => {
          f = {
            followerId: f.id,
            ...f.toJSON(),
            isFollowed: currentFollowings.some(id => id === f.id)
          }
          delete f.Followship
          delete f.id
          return f
        })
          .reverse()
        return cb(null, followers)
      })
      .catch(err => cb(err))
  },
  getFollowings: (req, cb) => {
    return Promise.all([
      User.findByPk(req.params.id, {
        include: [{
          model: User,
          as: 'Followings',
          attributes: ['id', 'name', 'avatar', 'introduction', 'account']
        }]
      }),
      Followship.findAll({
        where: { followerId: helpers.getUser(req).id },
        raw: true
      })
    ])
      .then(([user, userFollowings]) => {
        if (!user.Followings.length) return cb(null, [])
        const currentFollowings = userFollowings.map(f => f.followingId)
        const followings = user.Followings.map(f => {
          f = {
            followingId: f.id,
            ...f.toJSON(),
            isFollowed: currentFollowings.some(id => id === f.id)
          }
          delete f.Followship
          delete f.id
          return f
        })
          .reverse()
        return cb(null, followings)
      })
      .catch(err => cb(err))
  },
  getTopTenUsers: (req, cb) => {
    Promise.all([
      User.findAll({
        attributes: ['id', 'name', 'account', 'email', 'avatar', 'coverPhoto', 'createdAt', 'updatedAt',
          [sequelize.literal('(SELECT COUNT (*) FROM Followships WHERE Followships.following_id = User.id )'), 'followerCount'],
          [sequelize.literal('(SELECT COUNT (*) FROM Followships WHERE Followships.follower_id = User.id )'), 'followingCount'],
          [sequelize.literal('(SELECT COUNT (*) FROM Tweets WHERE Tweets.user_id = User.id )'), 'tweetCount'],
          [sequelize.literal('(SELECT COUNT (*) FROM Likes WHERE Likes.user_id = User.id )'), 'likeCount']
        ]
      }),
      Followship.findAll({
        where: { followerId: helpers.getUser(req).id },
        raw: true
      })
    ])
      .then(([users, userFollowings]) => {
        const currentFollowings = userFollowings.map(f => f.followingId)
        const userData = users.map(user => {
          const data = {
            ...user.toJSON(),
            isFollowed: currentFollowings.some(id => id === user.id)
          }
          return data
        })
          .sort((a, b) => b.followerCount - a.followerCount)
          .slice(0, 10)
        return cb(null, userData)
      })
      .catch(err => cb(err))
  }
}

module.exports = userServices
